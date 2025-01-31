const Header = ({courseName}) => <h2>{courseName}</h2>
const Total = ({sumOfExercises}) => <h4>Total of {sumOfExercises} exercises</h4>
const Part = ({thePart}) => <p>{thePart.name} {thePart.exercises}</p>

const Content = ({courseParts}) => {
  return (
    <div>
      {courseParts.map(coursePart=>
      	<Part key={coursePart.id} thePart={coursePart} />
      	)
  	  }
    </div>
  )
}

const Course = ({courses}) => {
	const calcSumOfEx = courses.map(course=>course.parts.reduce((sum,part)=>sum+part.exercises,0))

	return (<>
		{courses.map((course, index)=>{
			return(
				<div key={course.id}>
				  <Header courseName={course.name} />
				  <Content courseParts={course.parts}/>
				  <Total sumOfExercises={calcSumOfEx[index]}/>
				</div>
				)
			})
		}
	</>
	)
}

export default Course