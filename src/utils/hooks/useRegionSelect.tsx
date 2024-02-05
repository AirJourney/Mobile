import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface IRegion {
  code: string;
  phoneCode: string;
  name: string;
}

const defaultRegion: IRegion = {
  code: "",
  phoneCode: "",
  name: "",
};

const useRegionSelect = (defaultValue?: IRegion): [IRegion, () => void] => {
  const navigate = useNavigate();
  const location = useLocation();
  const [region, setRegion] = useState<IRegion>(defaultValue || defaultRegion);

  useEffect(() => {
    if (!location.state || !(location.state.code && location.state.phoneCode)) return;
    setRegion(location.state);
  }, [location]);

  const showRegion = () => {
    navigate("/region", {
      replace: true,
      state: { from: location.pathname + location.search },
    });
  };
  return [region, showRegion];
};
export default useRegionSelect;
