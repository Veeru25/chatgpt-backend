

exports.forgotpassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
  
      if (!existingUser) {
        return res.status(404).json({ message: 'Email not found' });
      }
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET ,
        { expiresIn: '2m' } 
      );
      const otp = Math.random().toString().slice(2, 6); 
  
      
      // Update user document with the OTP and token
      await User.findOneAndUpdate(
        { email },
        { verifytoken: token, userotp: otp }
      );

      
  
      // Return the OTP and token in the response for testing or external handling
      return res.status(200).json({
        message: 'OTP generated successfully',
        otp, // Include this only for development/testing; remove in production
        token,
      });
    } catch (error) {
      console.error('Error in forgotpassword:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  


let mailTransporter =
    nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: 'veeruadimulam@gmail.com',
                pass: 'hxrc ivza tgiz tcmn'
            }
        }
    );

let mailDetails = {
    from: 'veeruadimulam@gmail.com',
    to: 'v1@mailinator.com',
    subject: 'Test mail',
    text: 'Node.js testing mail for GeeksforGeeks'
};

mailTransporter
    .sendMail(mailDetails,
        function (err, data) {
            if (err) {
                console.log('Error Occurs',err);
            } else {
                console.log('Email sent successfully');
            }
        });



