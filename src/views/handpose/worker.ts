const context: Worker = self as any; // eslint-disable-line no-restricted-globals

onmessage = async (event) => {
    console.log("event data", event.data)
};
