import bannerPromo from '../../resources/images/banner-promo.jpg'

const Banner = () => {
  return (
    <div className="banner">
        <img src={bannerPromo} alt="banner promo" />
        <div className="account">
            <button>
                Register Account
            </button>
            <button>
                Login
            </button>
        </div>
    </div>
  )
}

export default Banner;