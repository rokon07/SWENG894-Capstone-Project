const db = require("../routes/db-config")
const bcrypt = require("bcryptjs")

const register = async (req, res) => {
    const { email, password: Npassword, fname, lname, phone, dob, role } = req.body
    if (!email || !Npassword) {
        return res.json({ status: "error", error: "Please enter your email and password" })
    }
    else {

        console.log(email)

        db.query('SELECT email FROM user_data WHERE email = ?', [email], async (err, result) => {
            if (err) {
                throw err
            }
            if (result[0]) {
                return res.json({ status: "error", error: "Email has already been registered" })
            }
            else {
                const password = await bcrypt.hash(Npassword, 8)


                db.query('INSERT INTO user_data SET ?', {
                    email: email,
                    password: password,
                    fname: fname,
                    lname: lname,
                    phone: phone,
                    dob: dob,
                    role: role
                }, (error, results) => {
                    if (error) {
                        throw error
                    }
                    return res.json({ status: "success", success: "User has been registered" })
                })
            }
        })
    }
}
module.exports = register