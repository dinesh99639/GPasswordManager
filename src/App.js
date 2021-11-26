import { useEffect, useState } from "react";
import { Button } from '@mui/material';

// import storage from './Utils/Storage';
import { getAllFiles, createFile, removeAllFiles, updateFile, downloadFile } from './api/drive';
import initApp from './api/init';


function App() {
    const [state, setState] = useState({
        isLoggedIn: false,
        dataFileId: null,
        data: ''
    });

    const login = async () => {
        await window.gapi.auth2.getAuthInstance().signIn();

        let isLoggedIn = true;
        let dataFileId = null;
        let data = '';
    
        let res = await getAllFiles();
    
        if (res.files.length === 0) {
            res = await createFile()
            res = { files: [{ id: res.id }] }
        }
        dataFileId = res.files[0].id;
    
        localStorage.setItem('dataFileId', dataFileId);
    
        res = await downloadFile(dataFileId);
        data = res.body;
    
        setState({ isLoggedIn, dataFileId, data })
    }

    const logout = () => {
        window.gapi.auth2.getAuthInstance().signOut();
        setState({
            isLoggedIn: false,
            dataFileId: null,
            data: ''
        })
        localStorage.clear();
    }

    useEffect(() => {
        initApp(setState)
    }, []);

    return (<>
        <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <Button variant="contained" onClick={login}>Login</Button>
            <Button variant="contained" onClick={logout}>Logout</Button>

            <br />
            <Button variant="contained" onClick={async () => { console.log(await getAllFiles()) }}>getAllFiles</Button>
            <Button variant="contained" onClick={async () => { console.log(await createFile()) }}>createFile</Button>
            <Button variant="contained" onClick={async () => { console.log(await removeAllFiles()) }}>removeAllFiles</Button>
            <Button variant="contained" onClick={async () => { console.log(await downloadFile(state.dataFileId)) }}>downloadFile</Button>
            <Button variant="contained" onClick={async () => { console.log(await updateFile(state.dataFileId, "updated")) }}>updateFile</Button>

            <br />
            <Button variant="contained" onClick={() => { console.log(state) }}>getState</Button>

        </div>
    </>);
}

export default App