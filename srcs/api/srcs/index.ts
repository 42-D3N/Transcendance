import app from "./server.ts";
const port = process.env.PORT || 4242;

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
