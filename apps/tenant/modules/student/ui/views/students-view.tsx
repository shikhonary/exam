"use client";

import { useStudents } from "@workspace/api-client";
import { List } from "../components/desktop/list";
import { MobileList } from "../components/mobile/list";
import { useDeleteStudent, useToggleStudentActive } from "@workspace/api-client";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

export const StudentsView = () => {
  const { openDeleteModal } = useDeleteModal();

  const { data: students, isLoading: isQueryLoading } = useStudents();

  const deleteMutation = useDeleteStudent();
  const toggleActiveMutation = useToggleStudentActive();

  const isLoading = isQueryLoading;

  const studentItems = students?.items || [];
  const total = students?.total || studentItems.length;

  const toggleActive = async (id: string) => {
    await toggleActiveMutation.mutateAsync({ id });
  };

  const handleDeleteStudent = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "student",
      entityName: name,
      onConfirm: (id) => {
        deleteMutation.mutateAsync({ id: id });
      },
    });
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        <List
          students={students?.items ?? []}
          isLoading={isLoading}
          total={total}
          onToggleActive={toggleActive}
          onDelete={handleDeleteStudent}
        />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <MobileList
          isLoading={isLoading}
          students={students?.items ?? []}
          total={total}
          onToggleActive={toggleActive}
          onDelete={handleDeleteStudent}
        />
      </div>
    </>
  );
};
