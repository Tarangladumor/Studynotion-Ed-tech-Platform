import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { resetCart } from "../../slices/cartSlice";
import { setPaymentLoading } from "../../slices/courseSlice";

const BASE_URL = "http://localhost:4000/api/v1"

const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API
} = studentEndpoints

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }

        script.onerror = () => {
            resolve(false);
        }

        document.body.appendChild(script); 
    })
} 

export async function buyCourse(token,courses,userDetails,navigate,dispatch) {
    const toastId = toast.loading("Loading...");
    console.log(token);
    try {

        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

        console.log("RES..............",res);

        if(!res){
            toast.error("Razorpay SDK failed to load");
            return;
        }

        // initiate the order
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, 
            {courses},
            {Authorization: `Bearer ${token}`}
        );

        //  const orderResponse = await axios({
        //     method: 'post',
        //     url : COURSE_PAYMENT_API,
        //     data : {
        //         courses
        //     },
        //     headers : {Authorization: `Bearer ${token}`}
        //  });

         console.log("ORDER RESPONSE>>>>>>>>>>>>>>",orderResponse);


        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message);
        }

        console.log("ORDER RESPONSE>>>>>>>>>>>>>>",orderResponse);

        const options = {
            key: "rzp_test_Ay4W1Ps13NDIoK",
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id: orderResponse.data.data.id,
            name: "Studynotion",
            description: "Thank you for Purchasing the Course",
            image: rzpLogo,
            prefill: {
                name: `${userDetails.firstName}`,
                email : userDetails.email
            },
            handler: function(response) {

                // sendPaymentSuccessEmail(response, orderResponse.data.data.amount,token);

                verifyPayment({...response, courses}, token, navigate, dispatch);
            }
        }

        // console.log(options);

        const paymentObject = new window.Razorpay(options); 
        paymentObject.open();
        paymentObject.on("Payment.failed", function(response) {
            toast.error("oops, payment Failed")
            console.log(response.error);
        })

    } catch (error) {
        console.log("COURSE_PAYMENT_API_ERROR............",error);
        toast.error("Could not male Payment")
    }
    toast.dismiss(toastId);
}



async function sendPaymentSuccessEmail(response, amount, token){
    try{
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },{
            Authorization: `Bearer ${token}`
        })
    } catch(error){
        console.log("SEND_PAYMENT_SUCCESS_EMAIL_API_ERROR............",error);
    }
}

// async function verifyPayment(bodyData, token, dispatch, navigate){
//     const toastId = toast.loading("Verifying Payemnt....");
//     dispatch(setPaymentLoading(true));
//     try{
//         const response = await apiConnector("POST", COURSE_VERIFY_API, {
//             bodyData
//         },{
//             Authorization: `Bearer ${token}`
//         })

//         console.log(response);

//         if(!response.data.success){
//             throw new Error(response.data.message);
//         }

//         toast.success("Payment Successfull, You are added to the course");
//         navigate("/dashboard/enrolled-courses");
//         dispatch(resetCart());
//     } catch(error) {
//         console.log("COURSE_VERIFY_API_ERROR...........",error);
//         toast.error("Could noy verify payment");
//     }
//     toast.dismiss(toastId);
//     dispatch(setPaymentLoading(false));
// }


async function verifyPayment(bodyData, token, navigate, dispatch) {
    console.log("data.....",bodyData)
    console.log("token....",token)
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try{
        const response  = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization:`Bearer ${token}`,
        })

        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("payment Successful, you are addded to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }   
    catch(error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}