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

  const [searchCategory, setSearchCategory] = useState({
    fashion: true,
    food: true,
    furniture: true,
  });


  // useMemoによりレンダリングの度にitemsを検索するのではなく、
  // itemsが変更された時だけ検索するようにする。
  const displayedItems = useMemo(() => {
    console.log(searchCategory);
    if (!items) return [];

    if (!searchText) {
      return items.filter((item) => { // カテゴリー検索
        return (item.category_name === "fashion" && searchCategory.fashion) || (item.category_name === "food" && searchCategory.food) || (item.category_name === "furniture" && searchCategory.furniture);
      });
    } else {
      return items.filter((item) => {
        return item.name.toLowerCase().includes(searchText.toLowerCase());
      }).filter((item) => { // カテゴリー検索
        return (item.category_name === "fashion" && searchCategory.fashion) || (item.category_name === "food" && searchCategory.food) || (item.category_name === "furniture" && searchCategory.furniture);
      });
    }
  
  }, [items, searchText, searchCategory]);



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
      <div>

      Filter:<span> </span>
      <input type="text" onChange={(e) => setSearchText(e.target.value)} />
      </div>
      
      <div>
      <label>
        fashion
        <input
          type="checkbox"
          name="fashion"
          checked={searchCategory.fashion}
          onChange={(e) => setSearchCategory({
            ...searchCategory,
            // fashion: e.target.checked,
            fashion: !searchCategory.fashion
          })}
        />
      </label>

      <label>
        | food
        <input
          type="checkbox"
          name="food"
          checked={searchCategory.food}
          onChange={(e) => setSearchCategory({
            ...searchCategory,
            food: !searchCategory.food
          })}
        />
      </label>
      <label>
        | furniture
        <input
          type="checkbox"
          name="furniture"
          checked={searchCategory.furniture}
          onChange={(e) => setSearchCategory({
            ...searchCategory,
            furniture: !searchCategory.furniture
          })}
        />
      </label>
      </div>


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