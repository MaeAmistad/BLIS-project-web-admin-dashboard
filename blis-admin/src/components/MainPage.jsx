import { useNavigate } from "react-router-dom";
import photo from "../assets/bantaylogo.jpg";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white/90 flex items-center justify-center px-4">
      <div className="bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-800 backdrop-blur-xl shadow-2xl rounded-[3.5rem] p-10 w-full max-w-md text-center transition-all duration-300">
        

        <div className="flex justify-center mb-6">
          <img
            src={photo}
            alt="logo"
            onClick={() => navigate("/login")}
            className="w-72 h-72 rounded-full object-cover shadow-md ring-4 ring-green-200 cursor-pointer hover:scale-105 transition-transform duration-300"
          />
        </div>


        <div className="text-2xl md:text-5xl font-medium text-white">
          BLIRS
        </div>

      </div>
    </div>
  );
};

export default MainPage;