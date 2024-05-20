import React, {useState} from "react"
import DOMPurify from 'dompurify';
import styles from "../../styles/Post.module.css"
import {useCurrentUser} from "../../contexts/CurrentUserContext";
import {Badge, Card, Image, OverlayTrigger, Tooltip} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {MoreDropdown} from "../../components/MoreDropdown";
import {axiosRes} from "../../api/axiosDefaults";
import ConfirmationModal from "../../components/ConfirmationModal";

const Dog = (props) => {
    const {
        id,
        owner,
        is_owner,
        birthday,
        breed,
        characteristics,
        gender,
        is_adopted,
        name,
        size,
        description,
        main_image,
        created_at,
        updated_at,
        dogPage,
        setDogs,
    } = props;

    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Sanitize HTML content to prevent security issues
    const sanitizedDescription = React.useMemo(() => {
        return { __html: DOMPurify.sanitize(description) };
    }, [description]);

    const handleEdit = () => {
        navigate(`/dogs/${id}/edit`);
    };

    const handleDelete = async () => {
        setShowConfirmation(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axiosRes.delete(`/dogs/${id}/`);
            navigate(-1);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Card className={styles.Post}>
            <Card.Body className="d-flex justify-content-between flex-wrap">
                <div>
                    {is_adopted ? (
                        <Badge pill bg="success">
                            Found a home
                        </Badge>
                    ) : (
                        <Badge pill bg="danger">
                            Looking for a home
                        </Badge>
                    )}
                </div>
                <div className="d-flex align-items-center gap-3">
                    <span>{updated_at}</span>
                    {is_owner && dogPage && (
                        <MoreDropdown
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    )}
                </div>
            </Card.Body>
            <Link to={`/dogs/${id}`}>
                <div className={styles.SquareContainer}>
                    <Image className={styles.SquareImage} src={main_image} width="100%" alt={name} />
                </div>
            </Link>
            <Card.Body>
                {name && <h2 className="text-center">{name}</h2>}
                {sanitizedDescription && !dogPage && <Card.Text
                    className={styles.Truncate}
                    dangerouslySetInnerHTML={sanitizedDescription}
                />}
                {sanitizedDescription && dogPage && <Card.Text
                    dangerouslySetInnerHTML={sanitizedDescription}
                />}
                {!dogPage && <Card.Link href={`/dogs/${id}`}>View dog</Card.Link>}
            </Card.Body>
            <ConfirmationModal title="Confirm deletion" text="Are you sure you want to delete this dog?"
                show={showConfirmation}
                onHide={() => setShowConfirmation(false)}
                onConfirm={handleConfirmDelete}
            />
        </Card>
    )
}

export default Dog