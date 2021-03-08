import { useEffect, useState, useContext } from 'react'
import { Layout } from "../components/Layout";
import { HeroSlider } from "../components/HeroSlider";
import { ProductTab } from "../components/ProductTab";
import { HoverBanner } from "../components/Banner";
import { CountdownTimer } from "../components/Countdown";
import { TestimonialOne } from "../components/Testimonial";
import {ProductsContext, useProducts} from '../contexts/ProductsContext'
import testimonialOneData from "../data/testimonials/testimonial.json";
import featuredData from "../data/featured.json";
import productService from "../services/ProductService2";

const Home = () => {
  const [ localFeaturedProducts, setLocalFeaturedProducts ] = useState([])
  const [ heroSliderData, setHeroSliderData ] = useState([])
  const {featuredProducts} = useProducts();

  useEffect(() => {
    if (featuredProducts.length) {
      let featured = featuredData;
      featured = featured.map((e) => {
        if (!e.fromAPI) {
          return e;
        } else {
          return featuredProducts.find(
            (product) => product.displayName === e.displayName
          );
        }
      });
      productService.find({ category:"mirror-shop" }).then((res) => {
        let productDiscount = res.every(e=>parseFloat(e.discount)===parseFloat(res[0].discount))
          if(productDiscount){
            featured = featured.map(e=>{
              if(e.category === "mirror-shop"){
                e.discount = res[0].discount
              }
              return e
            })
          }
          setLocalFeaturedProducts(featured)

      const mirrors = featuredProducts.find(item => item.displayName.toLowerCase() === 'mirrors')
      const pf = featuredProducts.find(item => item.displayName.toLowerCase().includes('picture framing'))
      const canvas = featuredProducts.find(item => item.displayName.toLowerCase().includes('canvas printing'))

      setHeroSliderData([
        {
          id: 1,
          image: "../assets/images/hero-slider/hero-slider-one/header_1.jpg",
          subtitle: "MIRRORS",
          title: "Custom Mirrors",
          url: `/${mirrors?.category}/${mirrors?.id}`,
          button: "Frame Now"
        },
        {
          id: 2,
          image: "../assets/images/hero-slider/hero-slider-one/header_2.jpg",
          subtitle: "DIY FRAMES",
          title: "Design your own frames",
          url: `/${pf?.category}/${pf?.id}`,
          button: "Frame Now"
        },
        {
          id: 3,
          image: "../assets/images/hero-slider/hero-slider-one/header_3.jpg",
          subtitle: "CANVAS PRINTING",
          title: "Canvas Printing & Stretching",
          url: `/${canvas?.category}/${canvas?.id}`,
          button: "Start Now"
        }
      ])
        })
    }
  }, [featuredProducts])

  return (
    <Layout aboutOverlay={false}>
      {/* hero slider */}
      {heroSliderData.length > 0 ? (
        <HeroSlider
          sliderData={heroSliderData}
          spaceBottomClass="space-mb--50"
        />
      ) : ""}

      {/* featured categories */}
      <HoverBanner spaceBottomClass="space-mb--r100" />

      {/* other categories */}
      {localFeaturedProducts.length > 1 ? (
        <ProductTab
          featuredProducts={localFeaturedProducts.slice(0,8)}
          quickView={false}
        />
      ) : ""}

      {/* specials countdown */}
      {/* <CountdownTimer
        title="Father's Day Sale"
        image="/assets/images/countdown/fathers_day_deal.jpg"
        dateTime="July 07, 2020 12:12:00"
        url="/shop/left-sidebar"
        buttonText="Shop now"
        backgroundColorClass="bg-color--grey-two"
      /> */}

      <TestimonialOne
        testimonialData={testimonialOneData}
        spaceBottomClass="space-mb--r100"
      />

    </Layout>
  );
};

export default Home;
