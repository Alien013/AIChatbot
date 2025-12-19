import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext({});

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]); // ✅ always array
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: token },
      });
      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingUser(false);
    }
  };

  // const createNewChat = async () => {
  //   try {
  //     if (!user) {
  //       return toast.error("Login to create a new chat");
  //     }

  //     const { data } = await axios.post(
  //       "/api/chat/create",
  //       {},
  //       {
  //         headers: { Authorization: token },
  //       }
  //     );

  //     if (data.success && data.chat) {
  //       // ⬅ make sure your backend returns { success: true, chat: newChat }
  //       setChats((prev) => [data.chat, ...prev]);
  //       setSelectedChat(data.chat);
  //       navigate("/");
  //       toast.success("New chat created!");
  //     } else {
  //       // fallback if backend doesn't return chat
  //       await fetchUserChats();
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  // console.log(user);
  // console.log(token);

  const createNewChat = async () => {
    try {
      if (!user) {
        return toast.error("Login to create a new chat");
      }

      const { data } = await axios.post(
        "/api/chat/create",
        {},
        {
          headers: { Authorization: token }, // 🔥 Fix: send Bearer token
        }
      );

      console.log("🔍 create chat response:", data); // debug log

      console.log(data.success);
      console.log(data.chat);

      if (data.success) {
        if (data.chat) {
          // ✅ if backend returns chat object
          setChats((prev) => [data.chat, ...prev]);
          setSelectedChat(data.chat);
        } else {
          // ✅ fallback: fetch all chats again
          await fetchUserChats();
        }

        navigate("/");
        toast.success("New chat created!");
      } else {
        toast.error(data.message || "Failed to create chat");
      }
    } catch (error) {
      console.error("Create Chat Error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // const createNewChat = async () => {
  //   try {
  //     if (!user) {
  //       return toast.error("Login to create a new chat");
  //     }

  //     const { data } = await axios.post(
  //       "/api/chat/create",
  //       {}, // empty body, adjust if backend requires more
  //       { headers: { Authorization: token } }
  //     );

  //     // console.log(data);
  //     // console.log(data.chat);
  //     if (data.success) {
  //       if (data.chat) {
  //         // ✅ if backend returns chat object
  //         setChats((prev) => [data.chat, ...prev]);
  //         setSelectedChat(data.chat);
  //       } else {
  //         // ✅ if backend only returns message (like your current API)
  //         await fetchUserChats();
  //       }

  //       navigate("/");
  //       toast.success("New chat created!");
  //     } else {
  //       toast.error(data.message || "Failed to create chat");
  //     }
  //   } catch (error) {
  //     console.error("Create Chat Error:", error);
  //     toast.error(error.response?.data?.message || error.message);
  //   }
  // };

  const fetchUserChats = async () => {
    try {
      const { data } = await axios.get("/api/chat/get", {
        headers: { Authorization: token },
      });
      if (data.success) {
        setChats(data.chats || []); // ✅ ensure array
        if ((data.chats || []).length === 0) {
          await createNewChat();
          return fetchUserChats();
        } else {
          setSelectedChat(data.chats[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (user) {
      fetchUserChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setLoadingUser(false);
    }
  }, [token]);

  const value = {
    navigate,
    user,
    setUser,
    theme,
    fetchUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    setTheme,
    createNewChat,
    loadingUser,
    fetchUserChats,
    token,
    setToken,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);

// import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { dummyChats, dummyUserData } from "../assets/assets";
// import axios from "axios";

// import toast from "react-hot-toast";

// axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

// const AppContext = createContext(null);

// export const AppContextProvider = ({ children }) => {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
//   const [token, setToken] = useState(localStorage.getItem("token") || null);
//   const [loadingUser, setLoadingUser] = useState(true);

//   const fetchUser = async () => {
//     // setUser(dummyUserData);
//     // setUser();
//     try {
//       const { data } = await axios.get("/api/user/data", {
//         headers: { Authorization: token },
//       });

//       if (data.success) {
//         setUser(data.user);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoadingUser(false);
//     }
//   };

//   const createNewChat = async (chat) => {
//     try {
//       if (!user) {
//         return toast("login to create a new chat");
//       }
//       navigate("/");
//       await axios.get("/api/chat/create", {
//         headers: { Authorization: token },
//       });
//       await fetchUserChats();
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const fetchUserChats = async () => {
//     try {
//       const { data } = await axios.get("/api/chat/get", {
//         headers: { Authorization: token },
//       });
//       if (data.success) {
//         setChats(data.chats);

//         // if the user has no chats, create one
//         if (data.chats.length === 0) {
//           await createNewChat();
//           return fetchUserChats();
//         } else {
//           setSelectedChat(data.chats[0]);
//         }
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [theme]);

//   useEffect(() => {
//     if (user) {
//       fetchUserChats();
//     } else {
//       setChats([]);
//       setSelectedChat(null);
//     }
//   }, [user]);

//   useEffect(() => {
//     if (token) {
//       fetchUser();
//     } else {
//       setUser(null);
//       setLoadingUser(false);
//     }
//   }, [token]);

//   const value = {
//     navigate,
//     user,
//     setUser,
//     theme,
//     fetchUser,
//     chats,
//     setChats,
//     selectedChat,
//     setSelectedChat,
//     setTheme,
//     createNewChat,
//     loadingUser,
//     fetchUserChats,
//     token,
//     setToken,
//     axios,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export const useAppContext = () => useContext(AppContext);
