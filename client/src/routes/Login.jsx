import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from 'react-hook-form';
import { Button } from "../components/ui/Button";
import { SecondaryHoveredButton } from "../components/ui/StyledButtons";
import { useAuth } from "../hooks/useAuth";
import LoginInput from "../components/ui/LoginInput";
import { FiEye, FiEyeOff } from "react-icons/fi";



function Login() {
  const { login, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

  const onSubmit = async (formData) => {
    await login(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full flex items-center justify-center h-full  bg-lamaWhite xl:py-12'
    >
      <div className='xl:w-[60%] w-[95%] md:w-[60%] xl:h-auto  justify-between items-center h-full flex flex-col-reverse xl:flex-row shadow-2xl xl:mb-0 mt-5 mb-4 xl:mt-0 md:py-8 py-2 xl:py-3 xl:pb-5 bg-lamaWhite'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex w-full  xl:w-[52%]  border-t xl:border-none border-slate-100 h-full justify-center items-center'>
          <div className='flex h-full w-[85%]  xl:pr-6 pr-2 xl:mt-12 mt-2'>
            <div className='flex  h-full   items-center w-full flex-col gap-8 '>
              <div className='font-bold capitalize md:text-[28px] xl:w-[90%] w-full text-2xl pt-4 xl:pt-0  font-robotos text-[#0a151d] justify-center items-center text-center '>
                Sign In to Your Account
              </div>
              <div className='w-full flex justify-center items-center flex-col '>
                <div className='font-normal w-full items-center justify-center gap-5 text-base flex flex-col '>
                  <LoginInput
                    label="Email"
                    type="email"
                    name="email"
                    register={register}
                    error={errors?.email}
                  />
                  <div className="relative w-full">
                    <LoginInput
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      register={register}
                      error={errors?.password}
                      validation={{
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        },
                      }}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-500"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>
                <div className='pt-2 flex flex-col gap-5 justify-center items-center'>
                  <Button variant="gradient" size="gradient" loading={loading}>
                    Login
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div
          className='w-full xl:w-[48%] h-96 md:h-full xl:h-full flex justify-center items-center text-center rounded-t-lg xl:rounded-t-none  flex-col bg-[#ffffff] border-l border-slate-100 '
        >
          <div className="h-full w-full flex flex-col items-center justify-center">
            <img src="/images/login1.jpg" className=" w-60 h-60 object-contain" alt="" />
            <div className='flex items-center justify-center flex-col gap-3 w-[90%]  mt-5 md:pl-4 pl-3 md:mt-8'>
              <div className='font-normal text-[15px] md:text-base text-black font-poppins'>
                Enter your personal details and start your journey with us
              </div>
              <div className='xl:pt-6 pt-4'>
                <SecondaryHoveredButton href="/auth/register" title="Sign up" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
export default Login;