export enum ThemeConfigType {
  input = 'input',
  switch = 'switch',
  select = 'select',
  color = 'color',
  slider = 'slider',
  radio = 'radio',
  checkbox = 'checkbox',
}
export interface ThemeConfig {
  id: string;
  language: string;
  configs: ThemeConfigItemAll[];
}

export interface ThemeConfigItem {
  name: string;
  key?: string;
  type: ThemeConfigType;
  value: any;
}

export interface ThemeConfigItemInput extends ThemeConfigItem {
  type: ThemeConfigType.input;
  value: string;
}

export interface ThemeConfigItemSwitch extends ThemeConfigItem {
  type: ThemeConfigType.switch;
  value: boolean;
}

export interface ThemeConfigItemSelect extends ThemeConfigItem {
  type: ThemeConfigType.select;
  value: string;
  data: {
    name: string;
    key?: string;
    value: string;
  }[];
}

export interface ThemeConfigItemColor extends ThemeConfigItem {
  type: ThemeConfigType.color;
  value: string;
}

export interface ThemeConfigItemSlider extends ThemeConfigItem {
  type: ThemeConfigType.slider;
  value: number;
}

export type ThemeConfigItemRadio = ThemeConfigItemSelect;
export type ThemeConfigItemCheckbox = ThemeConfigItemSelect;
export type ThemeConfigItemAll =
  | ThemeConfigItemInput
  | ThemeConfigItemSwitch
  | ThemeConfigItemSelect
  | ThemeConfigItemColor
  | ThemeConfigItemSlider
  | ThemeConfigItemRadio
  | ThemeConfigItemCheckbox;
