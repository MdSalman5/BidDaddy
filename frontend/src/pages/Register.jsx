import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, clearError } from "../store/slices/authSlice";
import { authService } from "../services/authService";
import { toast } from "react-toastify";
import ThemeToggle from "../components/ThemeToggle";
import {
  Eye,
  EyeOff,
  Upload,
  Loader2,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  UserCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Star,
  Shield,
  Award,
  Gavel,
  Camera,
} from "lucide-react";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: "Bidder",
    bankAccountNumber: "",
    bankAccountName: "",
    bankName: "",
    upi: "",
    paypalEmail: "",
    profileImage: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file,
      });

      // Create preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (
          !formData.userName ||
          !formData.email ||
          !formData.password ||
          !formData.confirmPassword
        ) {
          toast.error("Please fill in all required fields");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return false;
        }
        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters long");
          return false;
        }
        return true;
      case 2:
        if (!formData.phone || !formData.address || !formData.role) {
          toast.error("Please fill in all required fields");
          return false;
        }
        return true;
      case 3:
        if (!formData.profileImage) {
          toast.error("Please upload a profile image");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(registerUser(formData));
      if (result.type === "auth/register/fulfilled") {
        toast.success("Welcome to BidDaddy! 🎉");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Account", description: "Basic information" },
    { number: 2, title: "Profile", description: "Personal details" },
    { number: 3, title: "Photo", description: "Profile picture" },
    { number: 4, title: "Payment", description: "Payment methods" },
  ];

  const roleOptions = [
    {
      value: "Bidder",
      title: "Bidder",
      description: "Participate in auctions and place bids",
      icon: User,
      color: "blue",
      benefits: [
        "Browse all auctions",
        "Place competitive bids",
        "Track your winnings",
        "Join communities",
      ],
    },
    {
      value: "Auctioneer",
      title: "Auctioneer",
      description: "Create and manage your own auctions",
      icon: Gavel,
      color: "purple",
      benefits: [
        "Create auction listings",
        "Manage bidding process",
        "Earn commissions",
        "Analytics dashboard",
      ],
    },
  ];

  const features = [
    { icon: Shield, title: "Secure Platform", desc: "Bank-level security" },
    { icon: Award, title: "Verified Items", desc: "Authenticated products" },
    { icon: Star, title: "Top Rated", desc: "4.9/5 user rating" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle variant="modern" />
      </div>

      {/* Left Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-auction rounded-2xl flex items-center justify-center shadow-lg">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Join BidDaddy
            </h2>
            <p className="text-lg text-gray-600">
              Create your account and start your auction journey
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                    currentStep >= step.number
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="font-semibold">{step.number}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-1 mx-2 transition-all duration-200 ${
                      currentStep > step.number ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Indicator */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {steps[currentStep - 1]?.title}
            </h3>
            <p className="text-gray-600">
              {steps[currentStep - 1]?.description}
            </p>
          </div>

          {/* Demo Mode Banner */}
          {authService.isDemoMode() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="font-semibold text-yellow-800">
                  Demo Mode Active
                </span>
              </div>
              <p className="text-sm text-yellow-700">
                Registration will create a demo account with sample data
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="userName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Username *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="userName"
                        name="userName"
                        type="text"
                        required
                        className="input-field pl-11"
                        placeholder="Choose a username"
                        value={formData.userName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="input-field pl-11"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="input-field pl-11 pr-11"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className="input-field pl-11 pr-11"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Profile Information */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        className="input-field pl-11"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Account Type *
                    </label>
                    <select
                      id="role"
                      name="role"
                      className="input-field"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="Bidder">Bidder</option>
                      <option value="Auctioneer">Auctioneer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      required
                      className="input-field pl-11"
                      placeholder="Enter your full address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Role Selection Cards */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Choose Your Role
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roleOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, role: option.value })
                          }
                          className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                            formData.role === option.value
                              ? `border-${option.color}-500 bg-${option.color}-50`
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <div
                              className={`w-12 h-12 rounded-xl bg-${option.color}-100 flex items-center justify-center`}
                            >
                              <Icon
                                className={`w-6 h-6 text-${option.color}-600`}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {option.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {option.description}
                              </p>
                            </div>
                          </div>
                          <ul className="space-y-1">
                            {option.benefits.map((benefit, index) => (
                              <li
                                key={index}
                                className="text-sm text-gray-600 flex items-center"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Profile Picture */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-slide-up">
                <div className="text-center">
                  <div className="flex flex-col items-center space-y-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <Camera className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <Upload className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div>
                      <input
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                        id="profileImage"
                      />
                      <label
                        htmlFor="profileImage"
                        className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Choose Profile Picture
                      </label>
                      <p className="text-sm text-gray-600 mt-2">
                        Upload a clear photo of yourself (JPG, PNG, max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Payment Information (for Auctioneers) */}
            {currentStep === 4 && formData.role === "Auctioneer" && (
              <div className="space-y-6 animate-slide-up">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Payment Information
                  </h4>
                  <p className="text-sm text-blue-700">
                    As an auctioneer, please provide at least one payment method
                    to receive your earnings.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="bankAccountNumber"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Bank Account Number
                    </label>
                    <input
                      id="bankAccountNumber"
                      name="bankAccountNumber"
                      type="text"
                      className="input-field"
                      placeholder="Account number"
                      value={formData.bankAccountNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bankAccountName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Account Holder Name
                    </label>
                    <input
                      id="bankAccountName"
                      name="bankAccountName"
                      type="text"
                      className="input-field"
                      placeholder="Full name on account"
                      value={formData.bankAccountName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bankName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Bank Name
                    </label>
                    <input
                      id="bankName"
                      name="bankName"
                      type="text"
                      className="input-field"
                      placeholder="Your bank name"
                      value={formData.bankName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="upi"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      UPI ID
                    </label>
                    <input
                      id="upi"
                      name="upi"
                      type="text"
                      className="input-field"
                      placeholder="your-upi@paytm"
                      value={formData.upi}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="paypalEmail"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      PayPal Email
                    </label>
                    <input
                      id="paypalEmail"
                      name="paypalEmail"
                      type="email"
                      className="input-field"
                      placeholder="paypal@email.com"
                      value={formData.paypalEmail}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Previous
                </button>
              )}

              {currentStep < (formData.role === "Auctioneer" ? 4 : 3) ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="ml-auto flex items-center px-8 py-3 bg-gradient-auction text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              )}
            </div>
          </form>

          {/* Sign In Link */}
          <div className="text-center pt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Features & Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-20 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white bg-opacity-15 rounded-full"></div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6">
              Start Your Auction Journey
            </h1>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Join our thriving community of collectors, sellers, and auction
              enthusiasts.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-purple-100">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Testimonial */}
            <div className="mt-12 p-6 bg-white bg-opacity-10 rounded-xl">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=40&h=40&fit=crop&crop=face"
                  alt="Sarah"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-purple-200 text-sm">Art Collector</div>
                </div>
              </div>
              <p className="text-purple-100 italic">
                "BidDaddy has transformed how I discover and collect unique
                pieces. The platform is secure, user-friendly, and the community
                is amazing!"
              </p>
              <div className="flex mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
