import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { Breadcrumb } from "../../components/Breadcrumb";
import productService from "../../services/ProductService2";
import { ProductProvider } from "../../contexts/ProductContext";
import { Configurations } from "../../components/Product";
import { usePrice } from "../../contexts/PriceContext";

const ProductBasic = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState(null);
  const [configurations, setConfigurations] = useState(null);
  const [img, setImg] = useState(null);
  const priceMatrix = usePrice();

  useEffect(() => {
    document.querySelector("body").classList.remove("overflow-hidden");
  });

  useEffect(() => {
    if (!priceMatrix || !slug) {
      return;
    }
    productService.get(slug, true).then((res) => {
      setProduct(res.product);
      setConfigurations(res.configurations);

      switch (res.product.displayName.toLowerCase()) {
        case "picture framing":
          setImg("/assets/images/backgrounds/frames.jpg");
          break;
        case "custom certificate framing":
          setImg("/assets/images/backgrounds/certificate.jpg");
          break;
        case "corkboards":
          setImg("/assets/images/backgrounds/corkboards.jpg");
          break;
        case "chalkboards":
          setImg("/assets/images/backgrounds/chalkboards.jpg");
          break;
        case "mirrors":
          setImg("/assets/images/backgrounds/mirrors.jpg");
          break;
        case "canvas printing & stretching":
          setImg("/assets/images/backgrounds/canvas.jpg");
          break;
        default:
          setImg("/assets/images/backgrounds/bg-parallax-1.jpg");
      }
    });
  }, [slug, priceMatrix]);

  return (
    <Layout>
      {/* breadcrumb */}
      <Breadcrumb
        pageTitle={product ? product.displayName : "Loading..."}
        backgroundImage={img}
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link
              href="/diy-framing"
              as={process.env.PUBLIC_URL + "/diy-framing"}
            >
              <a>DIY Framing</a>
            </Link>
          </li>
          <li>{product ? product.displayName : "Loading..."}</li>
        </ul>
      </Breadcrumb>

      {/* product details */}
      {product && configurations ? (
        <ProductProvider
          product={product}
          configurations={configurations}
          key={product.id}
        >
          <div className="product-details space-mt--r100 space-mb--r100">
            <Configurations />
          </div>
        </ProductProvider>
      ) : (
        ""
      )}
    </Layout>
  );
};

export default ProductBasic;
