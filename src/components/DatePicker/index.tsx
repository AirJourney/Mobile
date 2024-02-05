import { Input, DatePicker as NUTDatePicker } from "@nutui/nutui-react";
import { forwardRef, useImperativeHandle, useState } from "react";


interface IDatePickerProps 
extends Pick<React.ComponentProps<typeof NUTDatePicker>, 
"onConfirm"|"startDate"|"endDate"|"title"|"onCancel"
>{
  value?: string;
}
const DatePicker = (props: IDatePickerProps, ref: React.Ref<IAction>) => {
  const [show, setShow] = useState(false);
  const { value, onConfirm,  ...left } = props;

  // @ts-ignore
  const confirm = (...p) => {
    // @ts-ignore
    onConfirm?.(...p);
    setShow(false);
  };

  const cancel = () => {
    // onCancel?.();
    close();
  };

  const open = () => setShow(true);
  const close = () => setShow(false);

  useImperativeHandle(ref, () => ({
    open, 
    close
  }));
  return (
    <>
      <Input
        value={value}
        readOnly
        onClick={() => setShow(true)}
      />
      <NUTDatePicker
        defaultValue={value ? new Date(value) : undefined}
        onConfirm={confirm}
        onCancel={cancel}
        visible={show}
        onClose={close}
        {...left}
      />
    </>
  );
};

export interface IAction {
  open: () => void;
  close: () => void;
}

export default forwardRef<IAction, IDatePickerProps>(DatePicker);