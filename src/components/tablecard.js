import * as React from 'react';
import response from './response';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Pagination from '@mui/material/Pagination';
import { Button, TextField } from '@mui/material';
import './tablecard.css';
import { useMemo } from 'react';
import { useState } from 'react';

const TableCard = () => {
  const [page, setPage] = useState(1);
  const [data, setdata] = useState(response);
  const [editidx, setedit] = useState(-1);
  const [debounceTimeout, setDebounceTimeout] = useState(0); 
  const [Name, setname] = useState(null)
  const [selected, setselect] = useState(false)
  const [selectedRow, setrow] = useState(-1)
  const [peopleInfo, setPeopleInfo] = useState([]);

  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimeout !== 0) {
      clearTimeout(debounceTimeout);
    }
    const timeout = setTimeout(async () => {
      setdata(await performSearch(event));
    }, 100);
    setDebounceTimeout(timeout);
  };

  const performSearch = async(i) => {
    if(i !== null)
    {const newdata = data.filter((row) => (row.name.includes(i) || row.email.includes(i) || row.role.includes(i)))
    return newdata;
    }
    else {
      return null;
    }
  }

  const deleteids = []
  const handleCheck = (event,value) => {
    
    const { name, checked } = event.target;

     if(name === "allSelect") {
      let tempUser = data.map((user) => {
        return { ...user, isChecked: checked };
      });
      setdata(tempUser);
      setname("allSelect")
    } 
    
    else if(name !== "allSelect"){
        deleteids.push(event.target.id)
        let tempUser = data.map((user) => user.name === name ? { ...user, isChecked: checked } : user);
        setdata(tempUser);
    }
  

    console.log(checked)
  }

  const handleDeleteAll = () => {
    if(Name === "allSelect")
    {
      //const newdata = data.slice(0,10)
      console.log(data.slice(11,20))
      setdata(data.slice(10,20))
    }

    else{
    console.log(peopleInfo)
    const res = data.filter(el => {
      return !peopleInfo.find(element => {
         return element.id === el.id;
      });
   });
    console.log(res)
    setdata(res)
  }

  }

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleEdit = (e,name,i) => {
    const {value} = e.target;
    const newdata = data.map((row,j) => j === i ? {...row, [name] : value } : row)
    setdata(newdata)
  }

  const handleRemove = (i) => {
    const newdata = data.filter((row) => (row.id !== i))
    setdata(newdata)
  }

  const startEditing = (i) => {
    setedit(i)
  }

  const stopEditing = (i) => {
    setedit(-1)
  }

  const changecolor = (i) => {
    if(selected)
    {
    setselect(false)
    setrow(-1)
    }
    else
    {
    setselect(true)
    setrow(i)
    }
  }

  const currentTableData = useMemo(() => {
    const firstPageIndex = (page - 1) * 10;
    const lastPageIndex = firstPageIndex + 10;
    return data.slice(firstPageIndex, lastPageIndex);
  }, [page,data]);

return (
	<div style={{ height: 650, width: '100%', marginLeft:20 }}>
  <input type='text' placeholder="Search by name, email or Role" className="searchbar" onChange={(e) => {debounceSearch(e.target.value, debounceTimeout)}}></input>
        <table >
        <thead>
          <tr>
            <th><input type={'checkbox'} name='allSelect' checked={!data.some((user) => user?.isChecked !== true)}
            onChange={handleCheck}></input>All Select</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTableData.map((item,idx) => {
            const currentlyEditing = editidx === item.id;
            return (
              <tr key={idx} >
                <td className={(selectedRow === idx) && item.isChecked ? "tableSelected" : "" } ><input type={'checkbox'} className='toggle' onClick={() => changecolor(idx)}
                onChange={(e) => {
                if (e.target.checked) { 
                handleCheck(e)
                // add to list
                setPeopleInfo([...peopleInfo,{id: item.id, name: item.name, email: item.email, role: item.role}]);} 
                // remove from list
                else {setPeopleInfo(peopleInfo.filter((people) => people.id !== item.id))}}} 
                //-
                id={item.id} name={item.name} checked={item?.isChecked || false}></input></td>
                <td>{currentlyEditing ? (<TextField name={"name"} onChange={e => handleEdit(e, "name", idx)} />) : (item.name)}</td>
                <td>{currentlyEditing ? (<TextField name={"email"} onChange={e => handleEdit(e, "email", idx)} />) : (item.email)}</td>
                <td>{currentlyEditing ? (<TextField name={"role"} onChange={e => handleEdit(e, "role", idx)} />) : (item.role)}</td>
                <td>{currentlyEditing ? (<CheckIcon onClick={() => stopEditing()} />) : (<EditIcon onClick={() => startEditing(item.id)}/>)}
                <DeleteOutlineIcon className='btn-2' onClick={() => handleRemove(item.id)}/></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className='flex'>
      <Button variant="contained" color="error" id={'delete'} size="small" onClick={handleDeleteAll}>Delete Selected</Button>
      <Pagination count={currentTableData.length} page={page} onChange={handleChange} size="large" color="primary" className='pagecss' showFirstButton showLastButton/>
  </div>
  </div>
);

}


export default TableCard;


