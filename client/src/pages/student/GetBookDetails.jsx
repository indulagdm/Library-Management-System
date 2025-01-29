import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './studentComponentStyles.css'

const GetBookDetails = () => {

    const token = localStorage.getItem("token");

    const [title,setTitle] = useState("");
    const [author,setAuthor] = useState("");
    const [ISBN,setISBN] = useState("");
    const [genre,setGenre] = useState([]);
    const [publicationYear,setPublicationYear] = useState("");
    const [err,setErr] = useState(null);
    const [purchase,setPurchase] = useState(false);

    const {id} = useParams();

    useEffect(()=>{
        const getDetails = async()=>{
            try{
                const response = await fetch("http://localhost:4000/api/book/book/"+id,{
                    method:"GET",
                    headers:{authorization:`Bearer ${token}`}
                })

                const result = await response.json();
                if(response.ok){
                    setTitle(result.data.title);
                    setAuthor(result.data.author);
                    setISBN(result.data.ISBN);
                    setGenre(result.data.genre);
                    setPublicationYear(result.data.publicationYear);
                }else{
                    setErr(result.message);
                }

            }catch(error){
                setErr(error.message);
            }

        }

        getDetails();

    },[id,token]);

    const handlePurchase =async()=>{
        try{
            const confirmed = window.confirm("Are you sure for purchasing this book?");

            if(confirmed){
                const response = await fetch("http://localhost:4000/api/order/purchaseOrder/"+id,{
                    method:"POST",
                    headers:{authorization:`Bearer ${token}`}
                });

                const result = await response.json();
                if(response.ok){
                    alert("Your purchase completed.");
                    console.log(result);
                    setPurchase(true);
                }else{
                    alert(`${result.message}`);
                    setPurchase(true);
                }
            }else{
                alert("Purchase cancelled.")
            }

        }catch(error){
            setErr(error);
        }
    }
  return (
    <div>

        <p style={{color:"red"}}>{err}</p>
        <h1>{title}</h1>
        
        <div className="book-content">
            <label htmlFor="" className="book-label">Author</label>
            <input  className="value-field" value={author} readOnly/>
        </div>
        <div className="book-content">
            <label htmlFor="" className="book-label">ISBN</label>
            <input  className="value-field" value={ISBN} readOnly/>
        </div>
        <div className="book-content">
            <label htmlFor="" className="book-label">Publication Year</label>
            <input className="value-field" value={publicationYear} readOnly/>
        </div>

        <div className="book-content">
            <label htmlFor="" className="book-label">Genre</label>
            {genre.map((genres,index)=>(<div key={index} className='genre-item'><input className="value-field" value={genres} readOnly/></div>))}
        </div>


        <div className="purchase-order">
            <button onClick={handlePurchase} disabled={purchase}>Purchase order</button>
        </div>




        
         
           
            {/* <input value={genre}/> */}
           
      
    </div>
  )
}

export default GetBookDetails
