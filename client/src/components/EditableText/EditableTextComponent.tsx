import React from 'react';

import { EditableText } from '@blueprintjs/core/lib/esm/components/editable-text/editableText';

interface IEditableTextComponent {
  maxLength: number;
  initialValue: string;
  placeholder?: string;
  multiline?: boolean;
  maxLines?: number;
  minLines?: number;
  onConfirm: (text: string) => void;
}

const EditableTextComponent = (props: IEditableTextComponent) => {
  const [value, setValue] = React.useState<string>('');

  React.useEffect(() => {
    setValue(props.initialValue);
  }, [props.initialValue]);

  const handleChange = (text: string) => setValue(text);
  const handleConfirm = () => {
    props.onConfirm(value);
  };

  return (
    <div>
      <EditableText
        alwaysRenderInput={false}
        intent="none"
        value={value}
        maxLength={props.maxLength}
        multiline={props.multiline ? props.multiline : false}
        maxLines={props.maxLines}
        minLines={props.minLines}
        placeholder={props.placeholder ? props.placeholder : ''}
        className="pa1"
        confirmOnEnterKey={true}
        onChange={handleChange}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default EditableTextComponent;
