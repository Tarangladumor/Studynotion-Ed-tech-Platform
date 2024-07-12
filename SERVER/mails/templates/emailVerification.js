exports.otpTemplate = (otp) => {
return `<!DOCTYPE html>
        <html>
        <head>
        <title>Password update Confirmation</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padbing: 0;
            }

            .container {
                margin: 0 auto;
                max-width: 600px;
                padding: 20px;
                text-align: center;
            }

            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }

            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }

            .body {
                font-size: 28px;
                margin-bottom: 20px;
            }

            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }

            .highlight {
                font-weight: bold;
            }

        </style>    
        </head>
        <body>

            <div class="container">
                <a href="https://studynotion-edtech-project.vercel.app"><img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo"></a>
                <div class="message">OTP Verification Email</div>
                <div class="body">
                    <p>Dear User, </p>
                    <p>Thank you for registering with StudyNotion. To complete your registration, please use the fol
                        (One-Time Password) to verify your account:</p>
                    <h2 class="highlight">${otp}</h2>
                    <p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard t Once your account is verified, you will have access to our platform and its features.</p>
                </div>
                <div class="support">If you have any questions or need assistance, please feel free to reach out to href="mailto:info@studynotion.com">info@studynotion.com</a>. We are here to help!</div>
            </div>

        </body>
        </html>`
};
module.exports = this.otpTemplate;