import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { membersActions, membersSelectors } from "@core/redux/members/index";

const DEFAULT_FORM = {
  email: "",
  role: "",
  name: "",
};
const MemberPageContext = createContext({
  formData: DEFAULT_FORM,
  onTestButton: null,
});
export const MemberPageProvider = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const memberLoading = useSelector(membersSelectors.selectMembersLoading);
  const { params } = useRouteMatch();
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const memberDetailt = useSelector((state) => state.members.memberDetailt);
  const [memberId, setMemberId] = useState(null);

  const onSubmitForm = () => {
    history.push("/i/f/members");
  };

  const contextValue = useMemo(
    () => ({
      memberDetailt,
      formData,
      setFormData,
      onSubmitForm,
    }),
    [memberDetailt, onSubmitForm, formData, setFormData]
  );

  useEffect(() => {
    if (memberLoading === "idle") {
      dispatch(membersActions.fetchMember());
    }
    setMemberId(params.mid);
  }, [params, setMemberId]);

  useEffect(() => {
    if (memberId) {
      dispatch(membersActions.requestMemberId({ id: memberId }));
    }
  }, [memberId, dispatch]);

  return (
    <MemberPageContext.Provider value={contextValue}>
      {children}
    </MemberPageContext.Provider>
  );
};

export function withMemberPageContext(Component) {
  return function WrapperComponent(props) {
    return (
      <MemberPageProvider>
        <Component {...props} />
      </MemberPageProvider>
    );
  };
}

export const useMemberPage = () => useContext(MemberPageContext);
export default useMemberPage;
