import { Login } from "../Login";
import { Signup } from "../Signup";
import { ItemList } from "../ItemList";
import { useCookies } from "react-cookie";
import { MerComponent } from "../MerComponent";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { fetcher } from "../../helper";
import "react-toastify/dist/ReactToastify.css";

interface Item {
  id: number;
  name: string;
  price: number;
  category_name: string;
}
export const Home = () => {
  const [cookies] = useCookies(["userID", "token"]);
  const [items, setItems] = useState<Item[]>([]);

  const [searchText, setSearchText] = useState<string>("");

  // useMemoによりレンダリングの度にitemsを検索するのではなく、
  // itemsが変更された時だけ検索するようにする。
  const displayedItems = useMemo(() => {
    if (!searchText) return items;
    // if (!items) return [];
    return items.filter((item) => {
      return item.name.toLowerCase().includes(searchText.toLowerCase());
    });
  }, [items, searchText]);

  const fetchItems = () => {
    fetcher<Item[]>(`/items`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((data) => {
        console.log("GET success:", data);
        setItems(data);
      })
      .catch((err) => {
        console.log(`GET error:`, err);
        toast.error(err.message);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const signUpAndSignInPage = (
    <>
      <div>
        <Signup />
      </div>
      or
      <div>
        <Login />
      </div>
    </>
  );

  const itemListPage = (
    <MerComponent>
      <input type="text" onChange={(e) => setSearchText(e.target.value)} />
      <div>
        <span>
          <p>Logined User ID: {cookies.userID}</p>
        </span>
        <ItemList items={displayedItems} />
      </div>
    </MerComponent>
  );

  return <>{cookies.token ? itemListPage : signUpAndSignInPage}</>;
};
