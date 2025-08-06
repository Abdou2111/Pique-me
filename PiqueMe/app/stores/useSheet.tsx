import { create } from 'zustand';

type SheetStore = {
    expand:  () => void;
    collapse:() => void;
    setFns:  (o:{expand:()=>void;collapse:()=>void}) => void;
};

export const useSheet = create<SheetStore>((set: (arg0: any) => any) => ({
    expand:  () => {},
    collapse:() => {},
    setFns:  o => set(o),
}));