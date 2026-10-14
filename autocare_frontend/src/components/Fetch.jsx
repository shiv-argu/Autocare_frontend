
import React, { useState, useEffect } from "react";
import useSWR from 'swr';
const fetcher = (url) => fetch(url).then((res) => res.json());
import axios from "axios";
const FetchData= () => {
    // const [items, setItems] = useState([]);
    // const [dataIsLoaded, setDataIsLoaded] = useState(false);

    // useEffect(() => {
    //     axios
    //         .get("https://jsonplaceholder.typicode.com/users")
    //         .then((res) => {
    //             setItems(res.data);
    //             setDataIsLoaded(true);
    //         });
    // }, []);
    // if (!dataIsLoaded) {
    //     return (
    //         <div>
    //             <h1>Please wait some time....</h1>
    //         </div>
    //     );
    // }
    // return (
    //     <div className="App">
    //         <h1 className="geeks">GeeksforGeeks</h1>
    //         <h3>Fetch data from an API in React</h3>
    //         <div className="container">
    //             {items.map((item) => (
    //                 <div className="item" key={item.id}>
    //                     <ol>
    //                         <div>
    //                             <strong>User_Name: </strong>
    //                             {item.username},
    //                         </div>
    //                         <div>Full_Name: {item.name}</div>
    //                         <div>User_Email: {item.email}</div>
    //                     </ol>
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    // );
     const { data, error } = useSWR('https://jsonplaceholder.typicode.com/users', fetcher);
    if (error) return <p>Error loading data</p>;
    if (!data) return <p>Loading...</p>;
    return (
        <div>
            <ul>
                {data.map((user) => (
                    <li key={user.id}>
                        <h3>{user.username}</h3>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default FetchData;