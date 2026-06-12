;; Compute the size of a triangle from the length of its sides using
;; Heron's Formula.

;; What might solutions look like in a 1960s Lisp?  Lisp's flexibility
;; and extendability mean that, other than mostly using the syntax of
;; nested Symbolic Extensions, there's never been a single Lisp style!

;; We'll use a modern Scheme-like style which could have been written
;; in 1960 and would have been easily understood then.

;; A direct solution in Scheme-style..
(define (heron-triangle-version-1 a b c) ;
  (let ( (p (/ (+ a b c) 2)) )		 ; half the perimeter
	 (sqrt (* p (- p a) (- p b) (- p c))) ) )

;; A direct solution with less nesting.
(define (heron-triangle-version-2 a b c)
  (let* ( (perimeter (+ a b c))
	  (p (/ perimeter 2)) 		; half the perimeter
	  (pa (- p a))
	  (pb (- p b))
	  (pc (- p c)) )
    (sqrt (* p pa pb pc)) ) )

;; Can we get rid of the redundancy in the treatment of the sides?
;; - that would be overkill for only 3 sides,
;; - but what if we were working with e.g. N-sided polygons?

;; Also, the FORTRAN example checks the sides for having legitimate values
;; - let's do that too!

;; First define a few functions I would normally pull in from a library

(define (twice x) (+ x x))
(define (half x) (/ x 2))

;; if we're using lists, then
(define empty? null?)			; empty sequence
(define first car)			; first item in a sequence
(define rest cdr)			; the rest of the arguments

(define (fold-left f accum args)
  (if (empty? args)
      accum
      ;; next is a tail call, so NOT recursive in Scheme!
      (fold-left f (f (first args) accum) (rest args)) ) )

;; Exceptions and contracts wouldn't make sense in 1960
;; so let's do things in a simpler way

(define false #f)			; NULL in 1960
(define true #t)			; t in 1960
(define (error context message . values)
  (apply printf
	 (cons (string-append "Error in ~a: side ~a " message "!\n")
	       (cons context values) ) )
  false )

;; Now we can use fancier solutions

(define (check-each-side sides f message)
  (andmap (lambda (side)
	    (or (f side) (error sides message side)) )
	  sides ) )

(define (check-triangle-sides sides)
  (and (or (= 3 (length sides))
	   (error sides "expected 3 sides") )
       (check-each-side sides real? "not a real number")
       (check-each-side sides positive? "not a positive number")
       (let ( (perimeter (fold-left + 0 sides)) ) ; add up the sides
	 ;; check each side is less than the other two sides
	 ;; i.e. twice any size is less than the full perimeter
	 (check-each-side sides
			  (lambda (s) (or (< (twice s) perimeter)))
				"too big" ) ) ) )
  
(define (heron-triangle-version-3 sides)
  (let* ( (p (half (fold-left + 0 sides))) ; half perimeter
	  ;; define function to accumulate products of (- p side)
	  (*- (lambda (x accum) (* (- p x) accum))) )
    ;; return the answer
    (* p (fold-left *- 1 sides)) ) )

;; Smoke test

(let ( (triangle-area heron-triangle-version-3) )
  (let loop ( (data '( (3 4 5) (10 4 5) (3 4 0) (3 4) )) )
    (let ( (sides (first data)) )
      (when (check-triangle-sides sides)
	(printf "A triangle with sides ~a has area ~a.\n"
		sides (triangle-area sides) ) )
      (unless (empty? data)
	(loop (rest data) ) ) ) ) )
