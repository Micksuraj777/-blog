import { Link } from "react-router-dom";
import Logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import Banner from "../imgs/banner.png"

const BlogEditor = () => {
    const handleBannerUpload = (e) => {
        
        let img = e.target.files[0];

        console.log(img);
    }
  return (
    <>
      <nav className="navbar">
        <Link to="/">
          <img src={Logo} alt="logo" className="flex-none w-10" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">New blog</p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>
      <AnimationWrapper>
        <section>
            <div className="mx-auto max-w-[900px] w-full">
                <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                    <label htmlFor="uploadBanner">
                        <img src={Banner} alt="banner" className="z-20"/>
                        <input id="uploadBanner" type="file" 
                        accept=".png,.jpeg, .jpg"
                        hidden
                        onChange={handleBannerUpload}/>
                    </label>
                </div>
            </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
