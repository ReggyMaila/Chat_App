
const { verifyToken } = require("@clerk/clerk-sdk-node"); // or use your verifyToken helper

module.exports = async (socket, next) => {
  try {
    const rawToken = socket.handshake.auth?.token?.replace(/^Bearer\s+/i, "") || null;
    if (!rawToken) {
      socket.user = null;
      return next();
    }
    const verified = await verifyToken(rawToken, { secretKey: process.env.CLERK_SECRET_KEY });
    // payload fields vary; adjust if necessary
    socket.user = { id: verified.sub, email: verified.email_address || verified.email, name: verified.name || verified.email_address || verified.email };
    return next();
  } catch (err) {
    console.warn("socket auth failed:", err.message || err);
    socket.user = null;
    return next();
  }
};
