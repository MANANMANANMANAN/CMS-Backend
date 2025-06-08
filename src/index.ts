import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.status(200).json({message: "Faculty Serice is listening"});  
});
app.use("/faculty",);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

