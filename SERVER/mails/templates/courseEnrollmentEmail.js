exports.courseEnrollmentEmail = (courseName, name) => {
    return `<!DOCTYPE html>
    <html>
    <head>
      <title>Course Registation confirmation</title>
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

            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFD60A;
                calor: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
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
            <a href="https://studynotion-edtech-project.vercel.app"><ing class="logo" src="https://i.ibb.co/7Xy)
                alt="StudyNotion Logo"></a>
            <div class="message">Course Registration Confirmation</div>
            <div class="body">
            <p>Dear ${name},</p>
            <p>You have successfully registered for the course <span class="highlight">"${courseName}"</span
                are excited to have you as a participant!</p>
            <p>Please log in to your learning dashboard to access the course materials and start your learni
            </p> 
            <a class="cta" href="https://studynotion-edtech-project.vercel.app/dashboard">Go to Dashboard</a
        </div>
    
    </body>
    </html>`
};
