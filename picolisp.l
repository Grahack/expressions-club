(de glue (c l)
  (cond
    ((= 0 (length l)) "")
    ((= 1 (length l)) (car l))
    (T                (pack (car l) c  (glue c (cdr l))))
  ))
