import AnimationWrapper from '../common/page-animation';
import InputBox from '../components/input.component';
import Google from '../imgs/google.png';
import { Link, Navigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from '../common/session';
import { useContext, useRef } from 'react';
import { UserContext } from '../App';
import { authWithGoogle } from '../common/firebase';

const UserAuthForm = ({ type }) => {
  const { userAuth: { access_token }, setUserAuth } = useContext(UserContext);
  const formElement = useRef(null);

  const userAuthThroughServer = (serverRoute, formData) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoute = type === "sign-in" ? "/signin" : "/signup";

    if (!formElement.current) {
      console.error('Form reference is not available');
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    let form = new FormData(formElement.current);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { fullname, email, password } = formData;

    if (fullname && fullname.length < 3) {
      return toast.error("Fullname must be at least 3 letters long");
    }

    if (!email.length) {
      return toast.error("Enter the email");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Invalid email");
    }

    if (!passwordRegex.test(password)) {
      return toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase, and 1 uppercase");
    }

    userAuthThroughServer(serverRoute, formData);
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    try {
      const user = await authWithGoogle();
      if (user) {
        let serverRoute = "/google-auth";
        let formData = { access_token: await user.getIdToken() };
        userAuthThroughServer(serverRoute, formData);
      }
    } catch (error) {
      toast.error("Trouble signing in with Google");
      console.error(error);
    }
  };

  return (
    access_token ?
      <Navigate to="/" />
      :
      <AnimationWrapper keyValue={type}>
        <Toaster />
        <section className='h-cover flex items-center justify-center'>
          <form ref={formElement} className='w-[80%] max-w-[400px]'>
            <h1 className='text-4xl font-gelasio capitalize text-center mb-24'>
              {type === "sign-in" ? "Welcome back" : "Join us today"}
            </h1>
            {type !== "sign-in" &&
              <InputBox
                name="fullname"
                type="text"
                placeholder="Full Name"
                icon='fi-rr-user'
              />
            }
            <InputBox
              name="email"
              type="email"
              placeholder="email"
              icon='fi-rr-at'
            />
            <InputBox
              name="password"
              type="password"
              placeholder="password"
              icon='fi-rr-key'
            />
            <button className='btn-dark center mt-14'
              type='submit'
              onClick={handleSubmit}>
              {type.replace('-', ' ')}
            </button>
            <div className='relative w-full flex gap-2 my-10 opacity-10 up text-black font-bold items-center'>
              <hr className='w-1/2 border-black' />
              <p>or</p>
              <hr className='w-1/2 border-black' />
            </div>
            <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center'
              onClick={handleGoogleAuth}>
              <img src={Google} className='w-6' alt='google logo' /> <span>Continue with Google</span>
            </button>
            {type === "sign-in" ?
              <p className='mt-7 text-black text-center text-sm'>
                Not a member? <Link to="/sign-up" className='font-bold underline'>Join us today</Link>
              </p>
              :
              <p className='mt-7 text-black text-center text-sm'>
                Already a member? <Link to="/sign-in" className='font-bold underline'>Sign in instead</Link>
              </p>
            }
          </form>
        </section>
      </AnimationWrapper>
  )
}

export default UserAuthForm;
