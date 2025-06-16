import { useEffect, useState } from "react";
import axios from "axios";

const useEngagementTracker = (userId) => {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const startSession = async () => {
      try {
        const response = await axios.post("https://socialappbackend-n15j.onrender.com/api/v1/auth/engagement/start", { userId });
        setSessionId(response.data.sessionId);
      } catch (error) {
        console.error("Error starting session", error);
      }
    };

    const endSession = async () => {
      if (sessionId) {
        await axios.post("https://socialappbackend-n15j.onrender.com/api/v1/auth/engagement/end", { sessionId });
      }
    };

    startSession();

    window.addEventListener("beforeunload", endSession);

    return () => {
      endSession();
      window.removeEventListener("beforeunload", endSession);
    };
  }, [userId, sessionId]);
};

export default useEngagementTracker;
