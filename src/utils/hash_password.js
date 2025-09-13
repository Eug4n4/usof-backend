import bcypt from 'bcrypt'

const hash_password = (plainText) => {
	return bcypt.hash(plainText, 10)
}

export default hash_password;