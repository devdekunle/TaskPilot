import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectMembers } from "../store/slices/userSlice";
import Skeleton from "react-loading-skeleton";
import "../styles/project-card.css";

export const CardSkeleton = ({ cards }) => {
  return Array(cards)
    .fill(0)
    .map((item, index) => (
      <div
        className="project-card-skeleton"
        key={index}
        style={{ marginTop: "2rem", height: "auto" }}
      >
        <span>
          <Skeleton count={6} height={35} />
        </span>
      </div>
    ));
};

const ProjectMembers = ({
  token,
  projectId,
  title,
  onClick,
  teamLead,
  isChecked,
  onChange,
}) => {
  const [lists, setLists] = useState();

  const dispatch = useDispatch();
  const members = useSelector((state) => state.members);

  const handleCheckboxChange = () => {
    onChange(!isChecked);
  };

  useEffect(() => {
    dispatch(fetchProjectMembers({ projectId, token }));
  }, [dispatch, token, projectId]);

  useEffect(() => {
    if (members) {
      const memberList = [];
      const { projectMembers } = members;
      projectMembers.forEach((member) => {
        memberList.push(member);
      });

      setLists(memberList);
    }
  }, [members]);

  return (
    <>
      {members.isLoading ? (
        <CardSkeleton />
      ) : (
        <ul className="project-members">
          <h3>{title}</h3>
          {lists && lists.length > 0 ? (
            lists.map((member, index) => {
              const { member_role, user_details } = member;
              return (
                <li
                  key={user_details?.id}
                  onClick={() => onClick(user_details)}
                >
                  <span>{index + 1}</span>
                  <span>{`${user_details?.first_name} ${user_details?.last_name}`}</span>
                  <span
                    className={`${
                      member_role === "admin" ? "admin-user" : "user"
                    }`}
                  >
                    {member_role}
                  </span>
                  {teamLead && (
                    <label>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />
                      Task Lead
                    </label>
                  )}
                </li>
              );
            })
          ) : (
            <h2>No members</h2>
          )}
        </ul>
      )}
    </>
  );
};

export default ProjectMembers;
