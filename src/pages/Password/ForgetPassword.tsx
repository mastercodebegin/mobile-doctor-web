import React, { useEffect, useRef, useState } from 'react';
import { Mail, Key, CheckCircle, ArrowLeft, EyeOff, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BackToLogin, ForgotPassInput, SubmitButtonClass } from '../../helper/ApplicationConstants';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import { ForgotPassword, GenerateOTP } from './PasswordSlice';

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
const otpRefs = useRef([]);
const [verificationId, setVerificationId] = useState('');
const [apiOtp, setApiOtp] = useState('');
const [canResendOtp, setCanResendOtp] = useState(false);
const [resendTimer, setResendTimer] = useState(60);
const [timerInterval, setTimerInterval] = useState(null);

const dispatch = useDispatch<AppDispatch>()
const {isLoading} = useSelector((state: RootState) => state.PasswordSlice)

  const goToNextStep = () => setStep(step + 1);

  // Add these handler functions
const handleOtpChange = (index, value) => {
  if (value.length > 1) return;
  
  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);
  
  // Auto focus next input
  if (value && index < 3) {
    otpRefs.current[index + 1]?.focus();
  }
};

const handleOtpKeyDown = (index, e) => {
  if (e.key === 'Backspace' && !otp[index] && index > 0) {
    otpRefs.current[index - 1]?.focus();
  }
};

const handleOtpSubmit = () => {
  const enteredOtp = otp.join('');
  
  if (enteredOtp === apiOtp) {
    goToNextStep();
  } else {
    toast.error('Invalid OTP! Please check your email.');
  }
};

  // Otp Generate Function
const handleGenerateOTP = async () => {
  if(!email){
    toast.warn("Please enter your email address");
    return;
  }
  
  if(!validateEmail(email)){
    toast.warn("Please enter a valid email address");
    return;
  }
  
  const newOTPMail = {
    email: email
  }
  
  try {
    const res = await dispatch(GenerateOTP(newOTPMail)).unwrap();
    
    if(res?.responseDetails) {
      setVerificationId(res.responseDetails.verificationId);
      setApiOtp(res.responseDetails.otp.toString());
      toast.success(`OTP sent successfully to ${email}`);
      startResendTimer(); // Start timer when first OTP is sent
      goToNextStep();
    }
    
    console.log("OTP Response:", res);
  } catch (error) {
    toast.error("Failed to send OTP. Please check your email and try again.");
    console.log(error);
  }
}

// Re-send Otp Function
const startResendTimer = () => {
  setCanResendOtp(false);
  setResendTimer(60);
  
  const interval = setInterval(() => {
    setResendTimer((prev) => {
      if (prev <= 1) {
        setCanResendOtp(true);
        clearInterval(interval);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  
  setTimerInterval(interval);
};

const handleResendOtp = async () => {
  if (!canResendOtp) return;
  
  const newOTPMail = {
    email: email
  };
  
  try {
    const res = await dispatch(GenerateOTP(newOTPMail)).unwrap();
    
    if(res?.responseDetails) {
      setVerificationId(res.responseDetails.verificationId);
      setApiOtp(res.responseDetails.otp.toString());
      toast.success("OTP resent successfully!");
      
      // Clear current OTP inputs and start timer again
      setOtp(['', '', '', '']);
      otpRefs.current[0]?.focus();
      startResendTimer();
    }
  } catch (error) {
    toast.error("Failed to resend OTP. Please try again.");
    console.log(error);
  }
};

// Forgot Password Function
const handleForgotPassWord = async () => {
  if(!password || !confirmPassword) {
    toast.warn("Please fill all password fields");
    return;
  }
  
  if(password !== confirmPassword) {
    toast.warn("Passwords do not match");
    return;
  }
  
  if(password.length < 5) {
    toast.warn("Password must be at least 5 characters long");
    return;
  }
  
  const forgotPasswordData = {
    verificationId: verificationId,
    userEnteredOtp: apiOtp,
    newPassWord: password,
    email: email
  };
  
  try {
    const res = await dispatch(ForgotPassword(forgotPasswordData)).unwrap();
    
    if(res?.responseDetails) {
      toast.success("Password reset successfully!");
      goToNextStep(); // Only go to step 4 if API is successful
    }
    
    console.log("Forgot Password Response:", res);
  } catch (error) {
    toast.error("Failed to reset password. Please try again.");
    // Don't go to step 4 if API fails
    console.log(error);
  }
}

// Validation Function
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


// Replace the existing resetFlow function
const resetFlow = () => {
  setStep(1);
  setEmail('');
  setOtp(['', '', '', '']);
  setPassword('');
  setConfirmPassword('');
  setVerificationId('');
  setApiOtp('');
   setCanResendOtp(false);
  setResendTimer(60);
  
  // Clear timer if active
  if (timerInterval) {
    clearInterval(timerInterval);
    setTimerInterval(null);
  }
};

useEffect(() => {
  // Cleanup timer on component unmount
  return () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  };
}, [timerInterval]);

{isLoading && <Loading overlay={true} />}

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-6 h-6 text-cyan-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Forgot password?</h1>
            <p className="text-gray-600 text-sm">We'll send you the OTP.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={ForgotPassInput}
                required
              />
            </div>

<button
  onClick={handleGenerateOTP}
  disabled={!email || !validateEmail(email)}
  className={`w-full ${SubmitButtonClass} ${(!email || !validateEmail(email)) ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  Generate OTP
</button>
          </div>

          <div className="text-center mt-6">
            <Link to="/login" >
            <button
              onClick={resetFlow}
              className={BackToLogin}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to log in
            </button>
            </Link>
          </div>
        </div>
        {isLoading && <Loading overlay={true} />}
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-cyan-600" />
            </div>
            
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Enter Verification Code</h1>
            <p className="text-gray-600 text-sm mb-1">We sent a 4-digit OTP to</p>
            <p className="text-gray-900 font-medium text-sm">{email || 'olivia@untitledui.com'}</p>
          </div>

          <div className="space-y-6">
            {/* OTP Input Section */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => otpRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value.replace(/[^0-9]/g, ''))}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleOtpSubmit}
              disabled={!otp.every(digit => digit)}
              className={`w-full ${SubmitButtonClass}`}
            >
              Verify OTP
            </button>

            {/* Resend Section */}
<div className="text-center">
  <p className="text-gray-500 text-sm">
    Didn't receive the code?{' '}
    {canResendOtp ? (
      <button 
        onClick={handleResendOtp}
        className="text-cyan-600 hover:underline font-medium"
      >
        Resend OTP
      </button>
    ) : (
      <span className="text-gray-400">
        Resend OTP in {Math.floor(resendTimer / 60)}:{String(resendTimer % 60).padStart(2, '0')}
      </span>
    )}
  </p>
</div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-6">
            <button
              onClick={resetFlow}
              className={BackToLogin}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to email
            </button>
          </div>
        </div>
        {isLoading && <Loading overlay={true} />}
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-6 h-6 text-cyan-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Set new password</h1>
            <p className="text-gray-600 text-sm">Your new password must be different to previously used passwords.</p>
          </div>

          <div className="space-y-4">
            <div className='relative' >
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={ForgotPassInput}
              />
               <span
                              className="absolute right-3 top-[58%] -translate-y-0/2 cursor-pointer text-gray-500 hover:text-gray-700 transition"
                              onClick={() => setShowPass(!showPass)}
                            >
                              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                            </span>
            </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters.</p>

            <div className='relative' >
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
              <input
                type={showConPass ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={ForgotPassInput}
              />
               <span
                              className="absolute right-3 top-[58%] -translate-y-0/2 cursor-pointer text-gray-500 hover:text-gray-700 transition"
                              onClick={() => setShowConPass(!showConPass)}
                            >
                              {showConPass ? <EyeOff size={20} /> : <Eye size={20} />}
                            </span>
            </div>
<button
  onClick={handleForgotPassWord}
  disabled={!password || !confirmPassword || password !== confirmPassword}
  className={`w-full ${SubmitButtonClass} ${(!password || !confirmPassword || password !== confirmPassword) ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  Submit
</button>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={resetFlow}
              className={BackToLogin}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Forgot Password
            </button>
          </div>
        </div>
        {isLoading && <Loading overlay={true} />}
      </div>
    );
  }

  // if (step === 4) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
  //       <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-sm text-center">
  //         <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
  //           <CheckCircle className="w-6 h-6 text-green-600" />
  //         </div>
          
  //         <h1 className="text-2xl font-semibold text-gray-900 mb-4">Password reset</h1>
          
  //         <div className="mb-6">
  //           <p className="text-gray-600 text-sm mb-1">Your password has been successfully reset.</p>
  //           <p className="text-gray-600 text-sm">Click below to log in magically.</p>
  //         </div>
          
  //         <Link to="/login" >
  //         <button
  //           onClick={resetFlow}
  //           className={`w-full mb-4 ${SubmitButtonClass}`}
  //         >
  //           Continue
  //         </button>
  //         </Link>
  //       </div>
  // {isLoading && <Loading overlay={true} />}
  //     </div>
  //   );
  // }

//   // Option-2 
// if (step === 4) {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 relative overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
//         <div className="absolute top-20 right-10 w-16 h-16 bg-emerald-300 rounded-full opacity-30 animate-bounce" style={{animationDelay: '1s'}}></div>
//         <div className="absolute bottom-20 left-10 w-20 h-20 bg-teal-200 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
//         <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-green-300 rounded-full opacity-15 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        
//         {/* Floating particles */}
//         <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full opacity-40 animate-ping"></div>
//         <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-emerald-400 rounded-full opacity-30 animate-ping" style={{animationDelay: '1.5s'}}></div>
//         <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-teal-400 rounded-full opacity-50 animate-ping" style={{animationDelay: '0.8s'}}></div>
//       </div>

//       {/* Main Card with Enhanced Animation */}
//       <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-2xl text-center relative z-10 transform animate-bounce-in border border-green-100">
//         {/* Success Icon with Ripple Effect */}
//         <div className="relative mb-6">
//           <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
//             <CheckCircle className="w-10 h-10 text-white animate-pulse" />
//           </div>
//           {/* Ripple rings */}
//           <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-24 border-4 border-green-300 rounded-full opacity-30 animate-ping"></div>
//           <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-28 h-28 border-2 border-green-200 rounded-full opacity-20 animate-ping" style={{animationDelay: '0.5s'}}></div>
//         </div>

//         {/* Content with Slide-in Animation */}
//         <div className="space-y-4 animate-fade-in-up">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
//             Password Reset
//           </h1>
          
//           <div className="space-y-2 mb-8">
//             <p className="text-gray-600 text-base font-medium">Your password has been successfully reset!</p>
//             <p className="text-gray-500 text-sm">You can now log in with your new password</p>
//           </div>

//           {/* Enhanced Continue Button */}
//           <Link to="/login">
//             <button
//               onClick={resetFlow}
//               className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 relative overflow-hidden group"
//             >
//               <span className="relative z-10">Continue to Login</span>
//               {/* Shine effect */}
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:animate-shimmer"></div>
//             </button>
//           </Link>
//         </div>

//         {/* Decorative elements */}
//         <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full opacity-60 animate-bounce"></div>
//         <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-400 rounded-full opacity-40 animate-pulse"></div>
//       </div>
//     </div>
//   );
// }


// Option-3
if (step === 4) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-cyan-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-10 w-16 h-16 bg-cyan-300 rounded-full opacity-30 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-cyan-300 rounded-full opacity-15 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-40 animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-cyan-500 rounded-full opacity-30 animate-ping" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-blue-400 rounded-full opacity-50 animate-ping" style={{animationDelay: '0.8s'}}></div>
      </div>

      {/* Main Card with Enhanced Animation */}
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-2xl text-center relative z-10 transform animate-bounce-in border border-cyan-100">
        {/* Success Icon with Ripple Effect */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
            <CheckCircle className="w-10 h-10 text-white animate-pulse" />
          </div>
          {/* Ripple rings */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-24 border-4 border-cyan-300 rounded-full opacity-30 animate-ping"></div>
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-28 h-28 border-2 border-cyan-200 rounded-full opacity-20 animate-ping" style={{animationDelay: '0.5s'}}></div>
        </div>

        {/* Content with Slide-in Animation */}
        <div className="space-y-4 animate-fade-in-up">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Password Reset
          </h1>
          
          <div className="space-y-2 mb-8">
            <p className="text-gray-600 text-base font-medium">Your password has been successfully reset!</p>
            <p className="text-gray-500 text-sm">You can now log in with your new password</p>
          </div>

          {/* Enhanced Continue Button */}
          <Link to="/login">
            <button
              onClick={resetFlow}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 relative overflow-hidden group"
            >
              <span className="relative z-10">Continue to Login</span>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:animate-shimmer"></div>
            </button>
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-cyan-500 rounded-full opacity-40 animate-pulse"></div>
      </div>
      {isLoading && <Loading overlay={true} />}
    </div>
  );
}

  return null;
};

export default ForgetPassword;