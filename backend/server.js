import express  from "express"
import cors from 'cors'
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import foodRouter from "./routes/foodRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

// app config
const app = express()

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin:[process.env.FRONTEND_URL,process.env.ADMIN_URL],
  methods:["GET","POST","PUT","PATCH","DELETE"],
  credentials:true
}));


// api endpoints
app.use("/api/user", userRouter)
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/cart", cartRouter)
app.use("/api/order",orderRouter)

app.get("/", (req, res) => {
    res.send("API Working")
  });

  
  // db connection
  connectDB()
  .then(()=>{
    console.log("DB Connected!!");
    app.listen(process.env.PORT, () => console.log(`Server started on http://localhost:${process.env.PORT}`));
  })
  .catch((error)=>{
    console.log("DB not connected!!");
  })
