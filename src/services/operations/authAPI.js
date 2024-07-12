import toast from "react-hot-toast";
import { setLoading, setToken } from "../../slices/authSlice"
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";
import { setUser } from "../../slices/profileSlice";
import { resetCart } from '../../slices/cartSlice';


const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSWORD_API,
    RESETPASSTOKEN_API
} = endpoints;

export function sendOtp(email, navigate) {
    return async (dispatch) => {
        const toastid = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", SENDOTP_API, {
                email,
            })
            console.log("SEND OTP API RESPONSE ....", response);
            console.log(response.data.success);

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("OTP sent successfully")
            navigate("/verify-email")
        } catch (error) {
            console.log("SENDOTP API ERROR....", error)
            toast.error("Could not sent OTP")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastid)
    }
}




export function signUp(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate,
) {
    return async (dispatch) => {
        const toastid = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", SIGNUP_API, {
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp,
            });

            console.log("SIGNUP API RESPONSE...", response);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success("Signup Successfully")
            navigate("/login")
        } catch (error) {
            console.log("SIGNUP ERROR....", error);
            toast.error("Signup Failed");
            navigate("/signup")
        }
        dispatch(setLoading(false));
        toast.dismiss(toastid);
    }
}


export function login(email, password, navigate) {
    return async (dispatch) => {
        const toastid = toast.loading("Loading...")
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", LOGIN_API, {
                email, password
            })

            console.log("LOGIN API RESPONSE....", response);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Login sucessfully")
            dispatch(setToken(response.data.token))
            const userImage = response.data?.user?.image ? response.data.user.image :
                `https://api.dicebear.com/7.x/initials/svg?seed=${response.user.firstName} ${response.user.lastName}`
            dispatch(setUser({ ...response.data.user, image: userImage }))

            localStorage.setItem("token", JSON.stringify(response.data.token))
            localStorage.setItem("user", JSON.stringify(response.data.user))
            navigate("/dashboard/my-profile")
        } catch (error) {
            console.log("LOGIN API ERROR....", error)
            toast.error("Login Failed")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastid)
    }
}


export function logout(navigate) {
    return (dispatch) => {
        dispatch(setToken(null))
        dispatch(setUser(null))
        dispatch(resetCart())
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Logged Out")
        navigate("/")
    }
}

export function getPasswordResetToken(email, setEmailSent) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", RESETPASSTOKEN_API, { email });
            console.log("RESET PASSWORD TOKEN RESPONSE : ", response);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Reset Email sent");
            setEmailSent(true);
        } catch (error) {
            console.log("RESET PASSWORD TOKEN ERROR");
            toast.error("failed to sent email for resetting password")
        }
        dispatch(setLoading(false));
    }
}

export function resetPassword(password, confirmPassword, token) {
    return (async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", RESETPASSWORD_API, { password, confirmPassword, token });
            console.log("RESETPASSWORD_API RESPONSE",response);
            
            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Reset password Successfully")
        } catch (error) {
            console.log("RESET PASSWORD ERROR");
            toast.error("failed resetting password")
        }
        dispatch(setLoading(false));
    })
}