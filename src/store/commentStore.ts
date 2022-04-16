import React from "react";
import { atom } from 'recoil';
import { CommentInstance, Comment } from '../lexical-nodes';

export const allCommentInstancesState = atom<CommentInstance[]>({
  key: 'allCommentInstances',
  default: []
})

export const activeCommentState = atom<string | undefined>({
  key: 'activeCommentState',
  default: undefined
})
