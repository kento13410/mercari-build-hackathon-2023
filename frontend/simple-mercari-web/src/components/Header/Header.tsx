import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export const Header: React.FC = () => {
  const [cookies, _, removeCookie] = useCookies(["userID", "token"]);

  const navigate = useNavigate();

  const onLogout = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    removeCookie("userID");
    removeCookie("token");
    navigate("/");
  };

  return (
    <>
      <header>
        <p>
          <b>Simple Mercari</b>
        </p>
        <div className="LogoutButtonContainer">
          <button onClick={onLogout} id="MerButton">
            Logout
          </button>
        </div>
      </header>
    </>
  );
}
