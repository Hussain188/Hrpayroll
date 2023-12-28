const sql = require('mssql');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const { dbConfig } = require('./config'); 

// const dbConfig = {
//     server: 'MSI\\SQLEXPRESS',
//     database: 'HRSakee',
//     user: 'Hussain',
//     password: '1234',
//     options: {
//         encrypt: true,
//         trustServerCertificate: true,
//     },
// };

const pool = new sql.ConnectionPool(dbConfig);

// Arrays to store form data and SQL query result
const formDataArray = [];
const sqlDataArray = [];

// Function to handle form submission
async function handleFormSubmission(req, res) {
    try{
        const { email, subject, emailBody } = req.body;
        console.log('Received data:', { email, subject, emailBody });

        // Connect to the SQL Server
        
        await pool.connect();

        // Query example
        const result = await pool.query`SELECT * FROM HO1_identfcatn`;

        console.log(result.recordset);

        // Store form data and SQL query result in the arrays
        formDataArray.push({ email, subject, emailBody });
        sqlDataArray.push(...result.recordset);

        // Close the connection pool
        pool.close();

        // Send emails from formDataArray to sqlDataArray
        await sendEmails();

        // Send a response
        res.json({ message: 'PaySlips Sended successfully!' });
    } catch (error) {
        console.error('Error handling form submission:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to send emails from formDataArray to sqlDataArray
async function sendEmails() {
    try {
        // Create a Nodemailer transporter with your email configuration
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Replace with your email service (e.g., 'gmail')
            auth: {
                user: formDataArray[0].email, // Use the email from formDataArray
                pass: 'hicq ywjc lsmn juuz', // Replace with your email password
            },
        });

        // Loop through sqlDataArray and send emails
        for (const sqlData of sqlDataArray) {
            const { email, subject, emailBody } = formDataArray[0];
      
            // Check if sql.id matches the filename on the local disk
            const filename = sqlData.H01_emp_num; // Replace with the appropriate field from SQL
            const filePath = `C:\\Users\\91798\\OneDrive\\Desktop\\payslips\\${filename}.pdf`; // Adjust the path and extension

            try {
                // Read the file content
                const fileContent = await fs.readFile(filePath);

                // Attach the file to the email
                await transporter.sendMail({
                    from: formDataArray[0].email,
                    to: sqlData.H01_email_id,
                    subject: `${subject}`,
                    text: emailBody,
                    attachments: [
                        {
                            filename: `${filename}.pdf`,
                            content: fileContent,
                        },
                    ],
                });

                console.log(`Email sent to ${sqlData.H01_email_id} with Subject email text and attached file`);
            } catch (fileError) {
                console.error(`Error reading or attaching file for ${sqlData.H01_email_id}:`, fileError);
            }
        }
    } catch (error) {
        console.error('Error sending emails:', error);
    }
}

module.exports = { handleFormSubmission };
/*
  var a=fuction(x,y){
    return x+y;
  }
  var a=(x,y)=>x-y;
  

*/
