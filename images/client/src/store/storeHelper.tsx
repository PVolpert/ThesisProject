import { StateCreator } from 'zustand';

export type ImmerStateCreator<T, Z> = StateCreator<
    T,
    [['zustand/immer', never], never],
    [],
    Z
>;
