import Link from "next/link";
import { getFelacooIdentity } from "@/server/auth/felacoo-identity";
import { listProducts } from "@/server/services/ecommerce-service";

export const dynamic="force-dynamic";

export default async function EcommercePage({params}:{params:Promise<{siteId:string}>}){
  const {siteId}=await params;
  const identity=await getFelacooIdentity();
  if(!identity) return null;
  const products=await listProducts(identity.felacooUserId,siteId);
  return <main className="platform-page">
    <div className="platform-page-header">
      <div><span className="eyebrow">COMMERCE ENGINE</span><h1>Store Products</h1><p>One catalogue for physical, digital and dropship fulfilment.</p></div>
      <Link className="builder-primitive-button primary" href={"/builder/"+siteId}>Back to Builder</Link>
    </div>
    <section className="dashboard-card">
      <div className="commerce-engine-grid">
        <article><strong>Unified catalogue</strong><span>Physical · Digital · Dropship · Hybrid</span></article>
        <article><strong>Smart cart</strong><span>Mixed carts with shipping-aware totals</span></article>
        <article><strong>Fulfilment routing</strong><span>Warehouse · Download · Supplier</span></article>
        <article><strong>Order foundation</strong><span>Idempotent checkout + fulfilment state</span></article>
      </div>
    </section>
    <section className="dashboard-card">
      <div className="platform-section-heading"><div><span className="eyebrow">CATALOGUE</span><h2>{products.length} products</h2></div><span className="status-pill">ENGINE READY</span></div>
      {products.length===0?<div className="empty-state"><h3>No products yet</h3><p>Create your first product to start building the catalogue behind this storefront.</p></div>:
      <div className="commerce-product-table"><div className="commerce-product-row commerce-product-head"><span>Product</span><span>Type</span><span>Price</span><span>Inventory</span><span>Status</span></div>
      {products.map(product=><div className="commerce-product-row" key={product.id}><span><strong>{product.name}</strong><small>{product.sku||"No SKU"}</small></span><span>{product.productType}</span><span>{product.currency} {product.price.toFixed(2)}</span><span>{product.productType==="DIGITAL"?"Unlimited":product.inventoryQuantity}</span><span>{product.status}</span></div>)}</div>}
    </section>
  </main>;
}