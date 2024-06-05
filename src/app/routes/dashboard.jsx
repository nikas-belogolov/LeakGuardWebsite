import { useEffect, useRef } from "react";

export function loader({ context: { user } }) {
    console.log(user);
    return null;
}

export default function Dashboard() {

    const addDeviceRef = useRef(null);


    const handleAddDevice = () => {
        navigator.bluetooth.requestDevice({
            acceptAllDevices: true
        })
        .then(device => {
            console.log('> Name:             ' + device.name);
            console.log('> Id:               ' + device.id);
            console.log('> Connected:        ' + device.gatt.connected);
        })
        .catch(error => {
            console.log('Argh! ' + error);
        });
    }

    return (
        <>
            <h1>Dashboard</h1>
            <button ref={addDeviceRef} onClick={handleAddDevice}>Add device</button>
        </>
    )
}
