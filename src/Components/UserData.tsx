import React, { useState, ChangeEvent } from 'react';

interface UserData {
    fname: string;
    lname: string;
    email: string;
    number: string;
}

const UserData: React.FC = () => {
    const [data, setData] = useState<UserData[]>([]);
    const [formData, setFormData] = useState<UserData>({
        fname: "",
        lname: "",
        email: "",
        number: ""
    });
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const rowsPerPage = 5;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (editIndex !== null) {
            const updatedData = [...data];
            updatedData[editIndex] = {
                ...updatedData[editIndex],
                [name]: value,
            };
            setData(updatedData);
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = () => {
        if (editIndex !== null) {
            setEditIndex(null);
        } else {
            const newData = [...data, formData];
            setData(newData);
            setFormData({
                fname: "",
                lname: "",
                email: "",
                number: ""
            });
            setCurrentPage(Math.ceil(newData.length / rowsPerPage));
        }
    };

    const handleEdit = (index: number) => {
        setEditIndex(index);
    };

    const handleDelete = (index: number) => {
        const newData = data.filter((_, i) => i !== index);
        setData(newData);
        if (newData.length === 0) setSearchQuery("");  
        if (currentPage > 1 && newData.length < indexOfFirstRow) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = () => {
        setCurrentPage(1); 
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const filteredData = data.filter(
        user =>
            user.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const currentData = searchQuery ? filteredData.slice(indexOfFirstRow, indexOfLastRow) : data.slice(indexOfFirstRow, indexOfLastRow);

    const pageNumbers = [];
    const totalItems = searchQuery ? filteredData.length : data.length;
    for (let i = 1; i <= Math.ceil(totalItems / rowsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="main-container">
            <h1> Student Form </h1>
            <div className="form-container">
                <div className="form-group">
                    <label>Enter Your First Name: </label>
                    <input type='text' name='fname' value={formData.fname} onChange={handleChange} placeholder='Enter your First Name' className='input-field' />
                </div>
                <div className="form-group">
                    <label>Enter Your Last Name: </label>
                    <input type='text' name='lname' value={formData.lname} onChange={handleChange} placeholder='Enter your Last Name' className='input-field' />
                </div>
                <div className="form-group">
                    <label>Enter Your Email: </label>
                    <input type='text' name='email' value={formData.email} onChange={handleChange} placeholder='Enter your Email' className='input-field' />
                </div>
                <div className="form-group">
                    <label>Enter Your Mobile Number: </label>
                    <input type='text' name='number' value={formData.number} onChange={handleChange} placeholder='Enter your Mobile Number' className='input-field' />
                </div>
                <button type='button' onClick={handleSubmit} className='button'>
                    {editIndex !== null ? 'UPDATE' : 'ADD'}
                </button>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by name"
                    className="search-field"
                />
                <button type="button" onClick={handleSearch} className="search-button">Search</button>
            </div>
            {((searchQuery && filteredData.length > 0) || (!searchQuery && data.length > 0)) && (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Mobile Number</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item, index) => (
                                <tr key={indexOfFirstRow + index}>
                                    <td>{indexOfFirstRow + index + 1}</td>
                                    <td>
                                        {editIndex === indexOfFirstRow + index ? (
                                            <input type="text"name="fname" value={item.fname} onChange={handleChange} className='table-input-field'/>
                                        ) : (
                                            item.fname
                                        )}
                                    </td>
                                    <td>
                                        {editIndex === indexOfFirstRow + index ? (
                                            <input type="text" name="lname" value={item.lname} onChange={handleChange} className='table-input-field'/>
                                        ) : (
                                            item.lname
                                        )}
                                    </td>
                                    <td>
                                        {editIndex === indexOfFirstRow + index ? (
                                            <input type="text" name="email" value={item.email} onChange={handleChange} className='table-input-field'/>
                                        ) : (
                                            item.email
                                        )}
                                    </td>
                                    <td>
                                        {editIndex === indexOfFirstRow + index ? (
                                            <input type="text" name="number" value={item.number} onChange={handleChange} className='table-input-field'/>
                                        ) : (
                                            item.number
                                        )}
                                    </td>
                                    <td>
                                        {editIndex === indexOfFirstRow + index ? (
                                            <button onClick={handleSubmit} className='save-button'>Save</button>
                                        ) : (
                                            <button onClick={() => handleEdit(indexOfFirstRow + index)} className='edit-button'>Edit</button>
                                        )}
                                    </td>
                                    <td>
                                        <button onClick={() => handleDelete(indexOfFirstRow + index)} className='delete-button'>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!searchQuery && (
                        <div className="pagination">
                            {pageNumbers.map(number => (
                                <button
                                    key={number}
                                    onClick={() => handlePageChange(number)}
                                    className={`page-button ${currentPage === number ? 'active' : ''}`}>
                                    {number}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserData;
