import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Attendance = () => {
    const [students, setStudents] = useState([]);
    const [name, setName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [attendance, setAttendance] = useState(0);
    const [reloadData, setReloadData] = useState(false);

    useEffect(() => {
        axios.get('/api/students')
            .then((response) => {
                setStudents(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [reloadData]);

    const handleAddStudent = () => {
        axios.post('/api/students', { name, rollNumber, attendance })
            .then((response) => {
                setStudents([...students, response.data]);
                setName('');
                setRollNumber('');
                setAttendance(0);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const calculatePercentage = (attendance) => {
        const totalClasses = 100;
        return (attendance / totalClasses) * 100;
    };

    const handleAbsentClick = async (studentId) => {
        try {
            const response = await axios.post('/api/mark-absent', { studentId });
            console.log('Attendance updated:', response.data);
        } catch (error) {
            console.error('Error marking student as absent:', error);
        }
    };

    const handleSubmit= async ()=>{
        setReloadData(!reloadData);
        try{
            const response = await axios.post('/api/present');
            console.log('Submitted the attendance',response.data);
        }
        catch(err){
            console.log("Error while present: ", err);
        }
    }

    return (
        <div>
            <h1>Attendance Portal</h1>
            <div>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Roll Number" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} />
                <input type="number" placeholder="Attendance" value={attendance} onChange={(e) => setAttendance(e.target.value)} />
                <button onClick={handleAddStudent}>Add Student</button>
            </div>
            <div>
                <p>Total Students: {students.length}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Student Roll No</th>
                            <th>Student Name</th>
                            <th>Attendance</th>
                            <th>Mark Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            students.map((student) => (
                                <tr key={student.rollNumber}>
                                    <td>{student.rollNumber}</td>
                                    <td>{student.name}</td>
                                    <td>{calculatePercentage(student.attendance).toFixed(2)}%</td>
                                    <td>
                                        <button onClick={()=>handleAbsentClick(student._id  )}>Absent</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <button type="submit" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}

export default Attendance
