import { createHash, randomBytes } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export type CommerceProductType = "PHYSICAL" | "DIGITAL" | "DROPSHIP" | "HYBRID";

export type CommerceProduct = {
  id:string; ownerId:string; siteId:string; name:string; slug:string; description:string;
  productType:CommerceProductType; status:string; sku:string; price:number; compareAtPrice:number|null;
  currency:string; inventoryQuantity:number; shippingRequired:boolean; weightGrams:number;
  digitalAssetKey:string|null; digitalDeliveryConfig:Record<string,unknown>;
  supplierConfig:Record<string,unknown>; taxConfig:Record<string,unknown>; metadata:Record<string,unknown>;
};

const money=(v:number)=>Math.round(v*100)/100;

function mapProduct(row:Record<string,unknown>):CommerceProduct {
  return {
    id:String(row.id), ownerId:String(row.owner_id), siteId:String(row.site_id), name:String(row.name),
    slug:String(row.slug), description:String(row.description??""), productType:row.product_type as CommerceProductType,
    status:String(row.status), sku:String(row.sku??""), price:Number(row.price??0),
    compareAtPrice:row.compare_at_price==null?null:Number(row.compare_at_price),
    currency:String(row.currency??"ZAR"), inventoryQuantity:Number(row.inventory_quantity??0),
    shippingRequired:Boolean(row.shipping_required), weightGrams:Number(row.weight_grams??0),
    digitalAssetKey:row.digital_asset_key?String(row.digital_asset_key):null,
    digitalDeliveryConfig:(row.digital_delivery_config??{}) as Record<string,unknown>,
    supplierConfig:(row.supplier_config??{}) as Record<string,unknown>,
    taxConfig:(row.tax_config??{}) as Record<string,unknown>,
    metadata:(row.metadata??{}) as Record<string,unknown>
  };
}

export async function listProducts(ownerId:string,siteId:string){
  const admin=createAdminClient();
  const {data,error}=await admin.from("ecommerce_products").select("*").eq("owner_id",ownerId).eq("site_id",siteId).order("created_at",{ascending:false});
  if(error) throw error;
  return (data??[]).map(row=>mapProduct(row as Record<string,unknown>));
}

export async function createProduct(ownerId:string,input:{siteId:string;name:string;description?:string;productType?:CommerceProductType;price?:number;currency?:string;sku?:string;inventoryQuantity?:number;weightGrams?:number;digitalAssetKey?:string|null}){
  const admin=createAdminClient();
  const slug=(input.name||"product").toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g,"").trim().replace(/[\s_-]+/g,"-").slice(0,80)||"product";
  const row={
    id:crypto.randomUUID(),owner_id:ownerId,site_id:input.siteId,name:input.name,slug,description:input.description??"",
    product_type:input.productType??"PHYSICAL",status:"DRAFT",sku:input.sku??"",price:Number(input.price??0),
    currency:input.currency??"ZAR",inventory_quantity:Number(input.inventoryQuantity??0),
    shipping_required:input.productType!=="DIGITAL",weight_grams:Number(input.weightGrams??0),
    digital_asset_key:input.digitalAssetKey??null
  };
  const {data,error}=await admin.from("ecommerce_products").insert(row).select("*").single();
  if(error) throw error;
  return mapProduct(data as Record<string,unknown>);
}

export async function addToCart(ownerId:string,input:{siteId:string;cartId?:string;productId:string;variantId?:string|null;quantity:number;currency?:string}){
  const admin=createAdminClient();
  if(input.quantity<1||input.quantity>999) throw new Error("Quantity must be between 1 and 999.");
  let cartId=input.cartId;
  if(cartId){
    const {data}=await admin.from("ecommerce_carts").select("id").eq("id",cartId).eq("owner_id",ownerId).eq("status","OPEN").maybeSingle();
    if(!data) cartId=undefined;
  }
  if(!cartId){
    cartId=crypto.randomUUID();
    const {error}=await admin.from("ecommerce_carts").insert({id:cartId,owner_id:ownerId,site_id:input.siteId,currency:input.currency??"ZAR"});
    if(error) throw error;
  }
  const {data:product,error}=await admin.from("ecommerce_products").select("*").eq("id",input.productId).eq("owner_id",ownerId).eq("site_id",input.siteId).eq("status","ACTIVE").maybeSingle();
  if(error) throw error;
  if(!product) throw new Error("Product is unavailable.");
  const p=mapProduct(product as Record<string,unknown>);
  if(p.inventoryQuantity<input.quantity && p.productType!=="DIGITAL") throw new Error("Not enough inventory available.");
  const {data:existing}=await admin.from("ecommerce_cart_items").select("id,quantity").eq("cart_id",cartId).eq("product_id",p.id).is("variant_id",input.variantId??null).maybeSingle();
  const nextQty=Number(existing?.quantity??0)+input.quantity;
  if(existing){
    const {error}=await admin.from("ecommerce_cart_items").update({quantity:nextQty,updated_at:new Date().toISOString()}).eq("id",existing.id);
    if(error) throw error;
  }else{
    const {error}=await admin.from("ecommerce_cart_items").insert({id:crypto.randomUUID(),cart_id:cartId,product_id:p.id,variant_id:input.variantId??null,quantity:input.quantity,unit_price:p.price,currency:p.currency,snapshot:{name:p.name,sku:p.sku,type:p.productType}});
    if(error) throw error;
  }
  return {cartId};
}

export async function getCartSummary(ownerId:string,cartId:string){
  const admin=createAdminClient();
  const {data:cart,error:cartError}=await admin.from("ecommerce_carts").select("id,site_id,currency,status").eq("id",cartId).eq("owner_id",ownerId).maybeSingle();
  if(cartError) throw cartError;
  if(!cart||cart.status!=="OPEN") throw new Error("Cart not found.");
  const {data:items,error}=await admin.from("ecommerce_cart_items").select("id,quantity,variant_id,unit_price,product:ecommerce_products(*)").eq("cart_id",cartId);
  if(error) throw error;
  const mapped=(items??[]).map(row=>{
    const p=mapProduct(row.product as unknown as Record<string,unknown>);
    const quantity=Number(row.quantity),unitPrice=Number(row.unit_price);
    return {...p,quantity,variantId:row.variant_id?String(row.variant_id):null,unitPrice,lineTotal:money(quantity*unitPrice)};
  });
  const physicalSubtotal=money(mapped.filter(i=>i.productType==="PHYSICAL"||i.productType==="HYBRID").reduce((s,i)=>s+i.lineTotal,0));
  const digitalSubtotal=money(mapped.filter(i=>i.productType==="DIGITAL").reduce((s,i)=>s+i.lineTotal,0));
  const dropshipSubtotal=money(mapped.filter(i=>i.productType==="DROPSHIP").reduce((s,i)=>s+i.lineTotal,0));
  const subtotal=money(physicalSubtotal+digitalSubtotal+dropshipSubtotal);
  return {cartId,currency:String(cart.currency),items:mapped,physicalSubtotal,digitalSubtotal,dropshipSubtotal,subtotal,shipping:0,tax:0,total:subtotal,requiresShipping:mapped.some(i=>i.shippingRequired&&i.productType!=="DIGITAL")};
}

export async function createOrderFromCart(ownerId:string,input:{cartId:string;idempotencyKey:string;shippingAddress?:Record<string,unknown>;billingAddress?:Record<string,unknown>}){
  const admin=createAdminClient();
  const {data:existing}=await admin.from("ecommerce_orders").select("id,order_number,total,currency,payment_status").eq("owner_id",ownerId).eq("idempotency_key",input.idempotencyKey).maybeSingle();
  if(existing) return existing;
  const summary=await getCartSummary(ownerId,input.cartId);
  if(!summary.items.length) throw new Error("Cart is empty.");
  const {data:cart}=await admin.from("ecommerce_carts").select("site_id").eq("id",input.cartId).eq("owner_id",ownerId).single();
  const orderId=crypto.randomUUID(),orderNumber="FC-"+new Date().getFullYear()+"-"+randomBytes(4).toString("hex").toUpperCase();
  const {error}=await admin.from("ecommerce_orders").insert({
    id:orderId,owner_id:ownerId,site_id:cart.site_id,cart_id:input.cartId,order_number:orderNumber,currency:summary.currency,
    subtotal:summary.subtotal,shipping_total:summary.shipping,tax_total:summary.tax,total:summary.total,
    shipping_address:input.shippingAddress??{},billing_address:input.billingAddress??{},
    fulfillment_summary:{physical:summary.physicalSubtotal>0,digital:summary.digitalSubtotal>0,dropship:summary.dropshipSubtotal>0},
    idempotency_key:input.idempotencyKey
  });
  if(error) throw error;
  for(const item of summary.items){
    const {error:itemError}=await admin.from("ecommerce_order_items").insert({
      id:crypto.randomUUID(),order_id:orderId,product_id:item.id,variant_id:item.variantId,name:item.name,
      product_type:item.productType,sku:item.sku,quantity:item.quantity,unit_price:item.unitPrice,line_total:item.lineTotal,
      fulfillment_status:item.productType==="DIGITAL"?"AVAILABLE":"PENDING",digital_asset_key:item.digitalAssetKey,
      snapshot:{shippingRequired:item.shippingRequired,weightGrams:item.weightGrams}
    });
    if(itemError) throw itemError;
  }
  await admin.from("ecommerce_carts").update({status:"CHECKOUT",updated_at:new Date().toISOString()}).eq("id",input.cartId).eq("owner_id",ownerId);
  return {id:orderId,orderNumber,total:summary.total,currency:summary.currency,paymentStatus:"PENDING",fulfillment:{physical:summary.physicalSubtotal>0,digital:summary.digitalSubtotal>0,dropship:summary.dropshipSubtotal>0}};
}

export function createDownloadToken(){return randomBytes(32).toString("base64url");}
export function hashDownloadToken(token:string){return createHash("sha256").update(token).digest("hex");}

export async function resolveStoreBySlug(slug:string){
  const admin=createAdminClient();
  const {data,error}=await admin.from("build_requests").select("id,owner_id,business_name").eq("slug",slug).eq("status","published").maybeSingle();
  if(error) throw error;
  if(!data) throw new Error("Store not found.");
  return {siteId:String(data.id),ownerId:String(data.owner_id),businessName:String(data.business_name)};
}

export async function listPublicProducts(slug:string){
  const store=await resolveStoreBySlug(slug);
  const products=await listProducts(store.ownerId,store.siteId);
  return {store,products:products.filter(product=>product.status==="ACTIVE").map(product=>({
    id:product.id,name:product.name,slug:product.slug,description:product.description,productType:product.productType,
    price:product.price,compareAtPrice:product.compareAtPrice,currency:product.currency,shippingRequired:product.shippingRequired,
    inventoryQuantity:product.productType==="DIGITAL"?null:product.inventoryQuantity,sku:product.sku
  }))};
}
