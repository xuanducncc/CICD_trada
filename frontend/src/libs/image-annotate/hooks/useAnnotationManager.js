import { uuid } from "@utils/uuid";
import { IMAGE_ANNOTATION_TYPE } from "@utils/const";
import cloneDeep from "lodash-es/cloneDeep";
import { useState, useMemo, useCallback, useEffect } from "react";

const normalizedWorkItem = (workItem) => {
  const item = cloneDeep(workItem || {
    labeledItems: []
  });
  for (const li of item.labeledItems) {
    li.state = {};
    if (li.toolType === IMAGE_ANNOTATION_TYPE.CLASSIFICATION) {
      li.clientId = li.tool_id || uuid();
    } else {
      li.clientId = li.id || uuid();
    }
  }
  return item;
}

export default function useAnnotationManager({
  mode,
  workItem,
  onSelectLabeledItem,
  defaultLabeledItemId,
  onVoteUpLabeledItem,
  onVoteDownLabeledItem,
  onSubmitWorkItem,
  onSkipWorkItem,
}) {
  const [selectedLabeledItemId, setSelectedLabeledItemId] = useState(defaultLabeledItemId);
  const [activeAnnotationControl, setActiveAnnotationControl] = useState(true);
  const [draftedItem, setDraftedItem] = useState(normalizedWorkItem(workItem));

  const totalLabeledItem = useMemo(() => {
    return draftedItem?.labeledItems?.length;
  }, [draftedItem]);

  const selectedLabeledItemIndex = useMemo(() => {
    return selectedLabeledItemId ? draftedItem?.labeledItems?.findIndex(li => li.clientId === selectedLabeledItemId) : null;
  }, [draftedItem, selectedLabeledItemId]);

  const selectedLabeledItem = useMemo(() => {
    return selectedLabeledItemIndex !== null ? draftedItem?.labeledItems[selectedLabeledItemIndex] : null;
  }, [draftedItem, selectedLabeledItemIndex]);

  const hasNextLabeledItem = useMemo(() => {
    return selectedLabeledItemIndex !== null ? selectedLabeledItemIndex + 1 < totalLabeledItem : false;
  }, [selectedLabeledItemIndex, totalLabeledItem]);

  const hasPrevLabeledItem = useMemo(() => {
    return selectedLabeledItemIndex !== null ? selectedLabeledItemIndex - 1 >= 0 : false;
  }, [selectedLabeledItemIndex]);

  const shapes = useMemo(() => {
    return (draftedItem.labeledItems || []).filter(
      (li) => li.toolType === IMAGE_ANNOTATION_TYPE.DETECTION
    );
  }, [draftedItem]);

  const classes = useMemo(() => {
    return (draftedItem.labeledItems || []).filter(
      (li) => li.toolType === IMAGE_ANNOTATION_TYPE.CLASSIFICATION
    );
  }, [draftedItem]);

  const classesMap = useMemo(() => {
    return (classes || []).reduce((acc, curr) => {
      acc[curr.tool_id] = {
        ...curr,
        state: {
          visible: true,
          ...curr.state,
        },
      };
      return acc;
    }, {});
  }, [classes]);

  // Tool ids
  const classesIds = useMemo(() => {
    return (classes || [])
      .sort((shape1, shape2) => shape1.index - shape2.index)
      .map((shape) => shape.tool_id);
  }, [classes]);

  const shapesMap = useMemo(() => {
    return (shapes || []).reduce((acc, curr) => {
      curr.clientId = curr.clientId || uuid();
      acc[curr.clientId] = {
        ...curr,
        state: {
          visible: true,
          ...curr.state,
        },
      };
      return acc;
    }, {});
  }, [shapes]);

  const shapeIds = useMemo(() => {
    return (shapes || [])
      .sort((shape1, shape2) => shape1.index - shape2.index)
      .map((shape) => shape.clientId);
  }, [shapes]);

  const objects = useMemo(() => {
    return (shapeIds || []).map((clientId) => shapesMap[clientId]);
  }, [shapesMap, shapeIds]);

  const classObjects = useMemo(() => {
    return (classesIds || []).map((clientId) => classesMap[clientId]);
  }, [classesMap, classesIds]);

  const selectedShapeId = useMemo(() => {
    return shapesMap[selectedLabeledItemId] ? selectedLabeledItemId : null;
  }, [shapesMap, selectedLabeledItemId]);

  const selectedClassId = useMemo(() => {
    return classesMap[selectedLabeledItemId] ? selectedLabeledItemId : null;
  }, [classesMap, selectedLabeledItemId]);

  const selectedShape = useMemo(() => {
    return shapesMap ? shapesMap[selectedShapeId] || null : null;
  }, [selectedShapeId, shapesMap]);

  const selectedClass = useMemo(() => {
    return classesMap ? classesMap[selectedClassId] || null : null;
  }, [selectedClassId, classesMap]);

  const selectLabeledItemId = useCallback((id) => {
    setSelectedLabeledItemId(id);
    if (onSelectLabeledItem) {
      onSelectLabeledItem({ id })
    }
  }, []);

  const selectNextLabeledItem = useCallback(() => {
    if (!hasNextLabeledItem) { return; }
    const nextLabeledItem = draftedItem.labeledItems[selectedLabeledItemIndex + 1];
    selectLabeledItemId(nextLabeledItem.clientId);
  }, [draftedItem, selectedLabeledItemIndex, hasNextLabeledItem, selectLabeledItemId]);

  const selectPrevLabeledItem = useCallback(() => {
    if (!hasPrevLabeledItem) { return; }
    const prevLabeledItem = draftedItem.labeledItems[selectedLabeledItemIndex - 1];
    selectLabeledItemId(prevLabeledItem.clientId);
  }, [draftedItem, selectedLabeledItemIndex, hasPrevLabeledItem, selectLabeledItemId]);

  const updateShape = useCallback(
    (newShape) => {
      const oldShape = shapesMap[newShape.clientId];
      const mergedShape = { ...oldShape, ...newShape };
      const labeledItems = draftedItem.labeledItems.map((li) => {
        if (li.clientId === mergedShape.clientId) {
          return mergedShape;
        }
        return li;
      });

      setDraftedItem({
        ...draftedItem,
        labeledItems,
      });
    },
    [shapesMap, shapeIds, draftedItem, setDraftedItem]
  );

  const addNewShape = useCallback(
    (shape) => {
      shape.clientId = uuid();
      shape.index = draftedItem.labeledItems.length + 1;
      shape.name = `${shape.labelName} ${shape.index}`;
      const labeledItems = [...draftedItem.labeledItems, shape];
      setDraftedItem({
        ...draftedItem,
        labeledItems,
      });
      selectLabeledItemId(shape.clientId);
    },
    [selectLabeledItemId, draftedItem, setDraftedItem]
  );

  const deleteShape = useCallback(
    (shapeId) => {
      const labeledItems = draftedItem.labeledItems.filter(
        (li) => li.clientId !== shapeId
      );
      setDraftedItem({
        ...draftedItem,
        labeledItems,
      });
      selectLabeledItemId(null);
    },
    [selectLabeledItemId, objects]
  );

  const deleteSelectedShape = useCallback(() => {
    if (!selectedShapeId) {
      return;
    }
    deleteShape(selectedShapeId);
  }, [deleteShape, selectedShapeId]);

  const updateClass = useCallback(
    (cl) => {

      // Sort by tool_id
      let labelAlreadyInDraft = (classes || [])
        .filter(labelItem => labelItem.tool_id === cl.tool_id).length > 0
      if (labelAlreadyInDraft) {
        let newLabeledItems = []
        newLabeledItems = (draftedItem.labeledItems || []).map((li, index) => {
          return li.tool_id === cl.tool_id ? { ...cl, index } : li;
        });

        const newDraftedItem = {
          ...draftedItem,
          labeledItems: newLabeledItems,
        };
        setDraftedItem(newDraftedItem);
      } else {
        cl.id = uuid();
        cl.index = draftedItem.labeledItems.length + 1;
        const newLabeledItems = [...draftedItem.labeledItems, cl];
        const newDraftedItem = {
          ...draftedItem,
          labeledItems: newLabeledItems,
        };
        setDraftedItem(newDraftedItem);
      }

    },
    [setDraftedItem, draftedItem]
  );

  const submitWorkItem = useCallback(() => {
    onSubmitWorkItem(draftedItem);
  }, [onSubmitWorkItem, draftedItem]);

  const skipWorkItem = useCallback(() => {
    onSkipWorkItem(draftedItem);
  }, [onSkipWorkItem, draftedItem]);

  const voteUpLabeledItem = useCallback(async (labeledItem) => {
    const result = await onVoteUpLabeledItem(labeledItem || selectedLabeledItem);
    if (result.error) {
      return;
    }
    if (hasNextLabeledItem) {
      selectNextLabeledItem();
    }
  }, [onVoteUpLabeledItem, selectedLabeledItem, selectNextLabeledItem, hasNextLabeledItem]);

  const voteDownLabeledItem = useCallback(async (labeledItem) => {
    const result = await onVoteDownLabeledItem(labeledItem || selectedLabeledItem);
    if (result.error) {
      return;
    }
    if (hasNextLabeledItem) {
      selectNextLabeledItem();
    }
  }, [onVoteDownLabeledItem, selectedLabeledItem, selectNextLabeledItem, hasNextLabeledItem]);

  useEffect(() => {
    const item = normalizedWorkItem(workItem);
    setDraftedItem(item);
  }, [workItem, setDraftedItem]);


  useEffect(() => {
    if (mode === 'review') {
      if (draftedItem.labeledItems.length > 0 && !selectedLabeledItemId) {
        setSelectedLabeledItemId(defaultLabeledItemId || draftedItem.labeledItems[0].clientId);
      } else if (defaultLabeledItemId && selectedLabeledItemId !== defaultLabeledItemId) {
        setSelectedLabeledItemId(defaultLabeledItemId);
      }
    }
  }, [draftedItem, selectedLabeledItemId, defaultLabeledItemId, mode, setSelectedLabeledItemId])

  return {
    objects,
    classes,
    shapeIds,
    shapesMap,
    classesIds,
    classesMap,
    classObjects,
    draftedItem,
    selectedClass,
    selectedShape,
    selectedShapeId,
    selectedClassId,
    activeAnnotationControl,
    deleteShape,
    updateShape,
    addNewShape,
    updateClass,
    skipWorkItem,
    submitWorkItem,
    voteUpLabeledItem,
    deleteSelectedShape,
    selectLabeledItemId,
    voteDownLabeledItem,
    selectNextLabeledItem,
    selectPrevLabeledItem,
    setActiveAnnotationControl,
  };
}
