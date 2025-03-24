const { currentUser } = useLocalAuth();
export default function useComment() {
  class MComment implements TComment {
    _id?: string;
    comment: string;
    attachments?: TAttachment[];
    createdBy: string;
    workOrder: string;
    createdAt?: string;
    updatedAt?: string;
    createdByName?: string;
    createdByType?: string;
    feedback?: string;
    justify?: string;

    constructor(comment: Partial<TComment> = {}) {
      this._id = comment._id || "";
      this.comment = comment.comment || "";
      this.attachments = comment.attachments || [];
      this.workOrder = comment.workOrder || "";
      this.createdAt = comment.createdAt || "";
      this.updatedAt = comment.updatedAt || "";
      this.createdBy = comment.createdBy || "";
      this.createdByName = comment.createdByName || "";
      this.createdByType = comment.createdByType || "";
      this.justify = comment.justify || "";
      this.feedback = comment.feedback || "";
    }
  }

  const comment = useState("comment", () => new MComment());
  const comments = useState("comments", (): TComment[] => []);
  const page = useState("commentPage", () => 1);
  const itemsPerPage = useState("itemsPerPage", () => 2);
  const search = useState("commentSearch", () => "");
  const pageRange = useState("commentPageRange", () => "-- - -- of --");
  const isCommentsLoaded = useState("isCommentsLoaded", () => false);

  async function addComment(_comment: TComment) {
    delete _comment._id;

    const { error, data } = await useLocalFetch("/api/comments/v1", {
      method: "POST",
      body: JSON.stringify(_comment),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function getCommentById(id: string) {
    const { data, error } = await useLocalFetch(`/api/auth/comments/id/${id}`, {
      method: "GET",
    });
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  function setComment(data?: TComment) {
    comment.value = new MComment(data);
  }

  const isInviteValid = useState("isInviteValid", () => false);

  async function getCommentsByWorkOrder(id: string) {
    const { error, data } = await useLocalFetch(
      `/api/comments/v1/work-order/${id}`,
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getCommentsByWorkOrderId(id: string) {
    return useLocalFetch(`/api/comments/v1/work-order/${id}`);
  }

  // async function setComments(id: string) {
  //   try {
  //     isCommentsLoaded.value = true;
  //     const _comments = (await getCommentsByWorkOrder(id)) as TComment[];
  //     comments.value = _comments as TComment[];
  //     isCommentsLoaded.value = false;
  //   } catch (error) {
  //     isCommentsLoaded.value = false;
  //   }
  // }

  async function getCommentsByFeedBackId(id: string, type?: string) {
    const commentFeedbackOrWOD =
      type === "workOrder" ? "work-order" : "feedback";
    const { error, data } = await useLocalFetch(
      `/api/comments/v1/${commentFeedbackOrWOD}/${id}`,
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function setComments(id: string, type: string) {
    try {
      isCommentsLoaded.value = true;
      const _comments = (await getCommentsByFeedBackId(
        id,
        type,
      )) as TCommentPaginated;

      let updateSeenIds: any = [];

      comments.value = _comments.items
        .map((comment: any) => {
          if (comment.createdBy === currentUser.value._id) {
            comment.justify = "end";
          } else {
            comment.justify = "start";
            if (
              ((Array.isArray(comment.seenBy) &&
                !comment.seenBy.includes(currentUser.value._id)) ||
                !comment?.seenBy) &&
              comment?._id
            ) {
              updateSeenIds.push(comment._id);
            }
          }
          return comment;
        })
        .sort(
          (firstComment: any, secondComment: any) =>
            new Date(firstComment.createdAt).getTime() -
            new Date(secondComment.createdAt).getTime(),
        );

      if (Array.isArray(updateSeenIds) && updateSeenIds.length > 0) {
        const seenBy = await updateSeenBy(updateSeenIds, currentUser.value._id);
        console.log("seenBy", seenBy);
      }
    } catch (error) {
      console.log("error :", error);
    } finally {
      isCommentsLoaded.value = false;
    }
  }

  async function updateSeenBy(ids: string[], seenById: string) {
    const { error, data } = await useLocalFetch(`/api/comments/v1/seen-by`, {
      method: "PUT",
      body: JSON.stringify({ seenById, ids }),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  return {
    comment,
    comments,
    page,
    itemsPerPage,
    pageRange,
    addComment,
    setComment,
    search,
    isCommentsLoaded,
    isInviteValid,
    setComments,
    getCommentById,
    getCommentsByWorkOrderId,
    updateSeenBy,
    getCommentsByFeedBackId,
  };
}
