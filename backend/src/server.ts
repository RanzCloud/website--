import app from "./app";
import { env } from "./config/env";

const PORT = Number(process.env.PORT || env.port || 8080);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Ranz Panel API running on port ${PORT}`);
});
