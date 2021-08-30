import { useState } from "react";

export const useIDGen = () => {
    const [id, setId] = useState(0);

    return {
        newId: (): number => {
            setId((prevState) => prevState + 1);
            return id;
        },
    };
};
